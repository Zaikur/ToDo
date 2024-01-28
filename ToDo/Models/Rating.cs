namespace ToDo.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int ItemId { get; set; } // ID of the item being rated
        public int Value { get; set; } // Rating value (1 to 5)
    }
}
