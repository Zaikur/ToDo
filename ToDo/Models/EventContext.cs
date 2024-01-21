/*
 * Quinton Nelson
 * 1/20/2024
 * Context for creating a database of events
 */

using Microsoft.EntityFrameworkCore;

namespace ToDo.Models
{
    public class EventContext : DbContext
    {
        public EventContext(DbContextOptions<EventContext> options) : base(options)
        {
        }
        public DbSet<EventModel>? Events { get; set; }
    }
}
