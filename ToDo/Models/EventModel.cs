/* Quinton Nelson
 * 1/14/2024
 * This file used to create Event objects
 */

namespace ToDo.Models
{
    public class EventModel
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime Created {  get; set; }
        public DateTime LastModified { get; set; } = DateTime.Now;
        public string Summary { get; set; }
        public string UId { get; set; }
        public string EventType { get; set; }
        public string Description { get; set; }

    }
}
