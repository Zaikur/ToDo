using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Net.Http.Headers;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using ToDo.Models;
using static ToDo.Controllers.CalendarController;

/*
 * Quinton Nelson
 * 1/14/2024
 * This controller handles aquiring access tokens to read/write to users calendar, and accepts calendar events from the page.
 * Also returns events, updates events, and deletes events when needed
 */

namespace ToDo.Controllers
{
    [Route("Calendar")]
    public class CalendarController : Controller
    {
        private readonly ILogger<CalendarController> _logger;
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly EventContext _context;

        public CalendarController(ILogger<CalendarController> logger,
                                  ITokenAcquisition tokenAcquisition,
                                  IHttpClientFactory httpClientFactory,
                                  EventContext context) // Inject EventContext here
        {
            _logger = logger;
            _tokenAcquisition = tokenAcquisition;
            _httpClientFactory = httpClientFactory;
            _context = context;
        }

        public async Task<string> GetAccessToken()
        {
            try
            {
                var accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(new[] { "Calendars.ReadWrite" });
                return accessToken;
            }
            catch (MsalUiRequiredException)
            {
                return "Error";
            }
        }

        //GetEvent returns an event of given id
        [HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            return Ok(eventItem);
        }

        //UpdateEvent updates an event of given id
        [HttpPut("UpdateEvent/{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventModel updatedEvent)
        {
            var eventItem = await _context.Events.FindAsync(id);
            if (id != updatedEvent.Id)
            {
                return BadRequest();
            }

            string currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (eventItem.User != currentUserId)
            {
                return Forbid();
            }

            updatedEvent.LastModified = DateTime.UtcNow;
            _context.Entry(updatedEvent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        //This method deletes a single event by the given id
        [HttpDelete("DeleteEvent/{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            string currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (eventItem.User != currentUserId)
            {
                return Forbid();
            }

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //This method adds a single event to the database
        [HttpPost("AddEvent")]
        public async Task<IActionResult> AddEvent([FromBody] EventModel eventModel)
        {
            if (eventModel == null)
            {
                return BadRequest("Event data is required.");
            }

            // Retrieve the user ID from the current user's claims
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            eventModel.User = userId; // Set the User property to the current user's ID

            // Add new event
            _context.Events.Add(eventModel);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Event added successfully." });
        }



        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }

        //Get events from the webpage
        [HttpPost("UploadEvents")]
        public async Task<IActionResult> UploadEventsAsync([FromBody] EventsModel eventData)
        {
            if (eventData?.Events == null)
            {
                _logger.LogError("Received null or empty events list");
                return BadRequest("No event data received.");
            }

            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);


            foreach (var rawEvent in eventData.Events)
            {
                var eventModel = EventModel.ParseEventFromString(rawEvent);
                eventModel.User = userId; // Set the User property to the current user's ID
                var existingEvent = await FindExistingEvent(eventModel.UId);

                if (existingEvent != null && !eventData.ForceUpdate)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Event already exists.",
                        existingEventId = existingEvent.Id,
                        actionRequired = "confirmUpdate"
                    });
                }
                else if (existingEvent != null)
                {
                    string currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (existingEvent.User != currentUserId)
                    {
                        return Forbid();
                    }
                    _context.Events.Update(existingEvent);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _context.Events.Add(eventModel);
                    await _context.SaveChangesAsync();
                }
            }

            return Json(new { success = true, message = "Events processed successfully." });
        }

        public class EventsModel
        {
            public List<string> Events { get; set; }
            public bool ForceUpdate { get; set; }
        }


        //This method used to see if an event already exists
        private async Task<EventModel> FindExistingEvent(string uId)
        {
            return await _context.Events.FirstOrDefaultAsync(e => e.UId == uId);
        }


        /***********************************************
         ** CURRENTLY COMMENTED OUT PENDING APPROVAL ***
         ***********************************************
         
        private async Task<IActionResult> AddEventToCalendar(string rawEvent)
        {
            var eventModel = ParseEventFromString(rawEvent);

            // Add new event
            _context.Events.Add(eventModel);
            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Events added successfully." });

        }

        private async Task<bool> AddEventToCalendar(string rawEvent)
        {
        var accessToken = await GetAccessToken();
        using (var httpClient = new HttpClient())
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var content = new
            {
                subject = graphEvent.Subject,
                body = new
                {
                    contentType = "HTML",
                    content = graphEvent.Body
                },
                start = new
                {
                    dateTime = graphEvent.Start.ToString("yyyy-MM-ddTHH:mm:ss"),
                    timeZone = "UTC"
                },
                end = new
                {
                    dateTime = graphEvent.End.ToString("yyyy-MM-ddTHH:mm:ss"),
                    timeZone = "UTC"
                }
            };

            var jsonContent = JsonContent.Create(content);
            var response = await httpClient.PostAsync("https://graph.microsoft.com/v1.0/me/events", jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Graph API Error: {errorResponse}");
                // Decide how to handle this error. Maybe return it to the client?
            }

            return response.IsSuccessStatusCode;
        }*/
    }
}
