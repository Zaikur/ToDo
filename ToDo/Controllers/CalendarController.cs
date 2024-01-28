using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using System.Security.Claims;
using System.Text.RegularExpressions;
using ToDo.Models;

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

        //Server side file fetching because MyTech doesn't support CORS headers
        [HttpGet("fetchICSFile")]
        public async Task<IActionResult> FetchICSFile(string fileUrl)
        {
            if (!IsValidLink(fileUrl))
            {
                return BadRequest("Invalid URL.");
            }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync(fileUrl);
                    response.EnsureSuccessStatusCode();
                    string fileContents = await response.Content.ReadAsStringAsync();
                    if (!IsValidICSFile(fileContents))
                    {
                        return BadRequest("The file is not a valid iCalendar file.");
                    }
                    return Ok(fileContents);
                }
                catch (HttpRequestException ex)
                {
                    // Handle errors (e.g., file not found, server error)
                    return StatusCode(500, $"Error fetching file: {ex.Message}");
                }
            }
        }

        //This method checks that the link received is as expected, and did not change
        private bool IsValidLink(string url)
        {
            return Regex.IsMatch(url, @"^https:\/\/my\.southeasttech\.edu\/ICS\/api\/ical\/[a-zA-Z0-9-]+$");
        }


        //This method checks that the file received is as expected
        private bool IsValidICSFile(string fileContents)
        {
            return fileContents.StartsWith("BEGIN:VCALENDAR");
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

        //This method returns true of an event already exists in the database
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

            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (string.IsNullOrEmpty(userId)) return Forbid();

            List<string> conflictingEventIds = new List<string>();
            foreach (var rawEvent in eventData.Events)
            {
                var eventModel = EventModel.ParseEventFromString(rawEvent);
                eventModel.User = userId; // Set the User property to the current user's ID
                var existingEvent = await FindExistingEvent(eventModel.UId);

                if (existingEvent != null)
                {
                    if (!eventData.ForceUpdate)
                    {
                        conflictingEventIds.Add(existingEvent.UId);
                        continue; // Add to conflict list and continue loop
                    }
                    else
                    {
                        // Update event details
                        UpdateEventDetails(existingEvent, eventModel);
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    _context.Events.Add(eventModel);
                    await _context.SaveChangesAsync();
                }
            }

            if (conflictingEventIds.Any())
            {
                return Json(new
                {
                    success = false,
                    message = "Some events already exist.",
                    conflictingEventIds = conflictingEventIds,
                    actionRequired = "confirmUpdate"
                });
            }

            return Json(new { success = true, message = "Events processed successfully." });
        }

        private void UpdateEventDetails(EventModel existingEvent, EventModel updatedEvent)
        {
            // Update the properties of the existing event with the new values
            existingEvent.Summary = updatedEvent.Summary;
            existingEvent.StartDate = updatedEvent.StartDate;
            existingEvent.EndDate = updatedEvent.EndDate;
            existingEvent.Description = updatedEvent.Description;
            existingEvent.EventType = updatedEvent.EventType;
            existingEvent.LastModified = DateTime.UtcNow;
            _context.Events.Update(existingEvent);
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
         ********** CURRENTLY NOT CONNECTED ************
         ***********************************************

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
