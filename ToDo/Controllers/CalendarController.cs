using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using ToDo.Models;

/*
 * Quinton Nelson
 * 1/14/2024
 * This controller handles aquiring access tokens to read/write to users calendar, and accepts calendar events from the page.
 */

namespace ToDo.Controllers
{
    [Route("Calendar")]
    public class CalendarController : Controller
    {
        private static string clientId = "1d02ff70-8c6c-45b5-af9f-e5827d388b4e";
        private static string clientSecret = "3a17ba05-ad75-4deb-8949-4c0528b64dfa";
        private static string tenantId = "e500a657-7a24-496f-a13e-5a38fbfda28b";
        private static string[] scopes = new string[] { "https://graph.microsoft.com/.default" };

        //get an access token
        private async Task<string> GetAccessToken()
        {
            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
                .WithClientSecret(clientSecret)
                .WithAuthority(new Uri($"https://login.microsoftonline.com/{tenantId}/v2.0"))
                .Build();

            AuthenticationResult result = await app.AcquireTokenForClient(scopes).ExecuteAsync();
            return result.AccessToken;
        }

        //Get events from the webpage
        [HttpPost("UploadEvents")]
        public IActionResult UploadEvents([FromBody] List<EventModel> events)
        {
            // Process the received events
            // Integrate with Microsoft Graph API to add events to the calendar Here

            return Json(new { success = true, message = "Events processed successfully." });
        }

        //push events to the calendar
        /*public async Task<IActionResult> AddEventToCalendar(EventModel calendarEvent)
        {
            var accessToken = await GetAccessToken();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var content = new StringContent(JsonContent.SerializeObject(calendarEvent), Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync("https://graph.microsoft.com/v1.0/me/events", content);

                if (response.IsSuccessStatusCode)
                {
                    // Event added successfully
                    return Json(new { success = true });
                }
                else
                {
                    // Handle errors here
                    return Json(new { success = false, message = "Error adding event to calendar." });
                }
            }
        }*/
    }
}
