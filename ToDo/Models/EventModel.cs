/* Quinton Nelson
 * 1/14/2024
 * This file used to create Event objects, and parse data from received strings to populate the objects
 */

using System.Globalization;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace ToDo.Models
{
    public class EventModel
    {
        public int Id { get; set; }
        public string? User { get; set; }
        public string? Summary { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime LastModified { get; set; } = DateTime.UtcNow;
        public string? UId { get; set; }
        public string? Description { get; set; }
        public string? EventType { get; set; }

        public static EventModel ParseEventFromString(string rawEvent)
        {
            var eventModel = new EventModel();
            var lines = rawEvent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
            StringBuilder descriptionBuilder = new StringBuilder();
            bool isDescription = false;

            foreach (var line in lines)
            {
                if (line.StartsWith("SUMMARY:"))
                {
                    eventModel.Summary = line.Substring("SUMMARY:".Length);
                    eventModel.EventType = "Unknown";
                    if (eventModel.Summary.StartsWith("Class Session"))
                    {
                        eventModel.EventType = "Class-Session";
                    }
                    else if (Regex.IsMatch(eventModel.Summary, @"[A-Z]{3}\s+\d{3}.*"))
                    {
                        eventModel.EventType = "Assignment";
                    }
                }
                else if (line.StartsWith("DTSTART:"))
                {
                    eventModel.StartDate = DateTime.ParseExact(line.Substring("DTSTART:".Length), "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
                }
                else if (line.StartsWith("DTEND:"))
                {
                    eventModel.EndDate = DateTime.ParseExact(line.Substring("DTEND:".Length), "yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
                }
                else if (line.StartsWith("UID:"))
                {
                    eventModel.UId = line.Substring("UID:".Length);
                }
                else if (line.StartsWith("DESCRIPTION:"))
                {
                    eventModel.Description = line.Substring("DESCRIPTION:".Length);
                }

                // Extract and clean the description
                var descriptionMatch = Regex.Match(rawEvent, @"DESCRIPTION:([\s\S]*?)(?=\b[A-Z]+:)");
                var description = descriptionMatch.Success ? descriptionMatch.Groups[1].Value.Trim() : "No description";

                description = Regex.Replace(description, @"\\n|\\", "");
                description = Regex.Replace(description, @"(\r\n|\n|\r)\s*", "");
                description = Regex.Replace(description, @"<(?!a\s*\/?|\/a\s*)[^>]+>", "", RegexOptions.IgnoreCase);
                description = Regex.Replace(description, @"(<a\s)", " $1", RegexOptions.IgnoreCase);
                description = Regex.Replace(description, @"&nbsp;", " ");

                //Prepend my.southeasttech.edu to <a> tags so links work correctly
                var linkRegex = new Regex(@"/ICS/[^\s""']+");
                description = linkRegex.Replace(description, match => "https://my.southeasttech.edu" + match.Value);

                eventModel.Description = description;

                eventModel.Description = description;
            }
            return eventModel;
        }

    }
}
