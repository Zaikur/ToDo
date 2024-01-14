/* Quinton Nelson
 * 1/14/2024
 * This file used to create CalendarEvent objects
 */

using System.Text.RegularExpressions;

namespace ToDo.Models
{
    public class EventModel
    {
        public DateTime DtStart { get; set; }
        public DateTime DtEnd { get; set; }
        public DateTime Created {  get; set; }
        public DateTime LastModified { get; set; } = DateTime.Now;
        public int Sequence { get; set; }
        public string Status { get; set; }
        public string Summary { get; set; }
        public string Uid { get; set; }
    }

    // IcsParser.cs
    public static class IcsParser
    {
        public static List<EventModel> ParseIcsFile(Stream fileStream)
        {
            // Logic to parse .ics file and populate List<EventModel>
            return new List<EventModel>();
        }
    }

}
