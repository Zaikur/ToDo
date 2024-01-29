
namespace ToDo.Models
{
    public class Filters
    {
        public Filters(string filterstring)
        {
            FilterString = filterstring ?? "all-all";
            string[] filters = FilterString.Split('-');
            Category = filters[0];
            Month = filters[1];
        }
        public string FilterString { get; }
        public string Category { get; }
        public string Month { get; }

        public bool HasCategory => Category.ToLower() != "all";
        public bool HasMonth => Month.ToLower() != "all";

        public static Dictionary<string, string> MonthFilterValues =>
            new Dictionary<string, string> {
                { "january", "January" },
                { "february", "February" },
                { "march", "March" },
                { "april", "April" },
                { "may", "May" },
                { "june", "June" },
                { "july", "July" },
                { "august", "August" },
                { "september", "September" },
                { "october", "October" },
                { "november", "November" },
                { "december", "December" }
            };

        public bool IsJanuary => Month.ToLower() == "january";
        public bool IsFebruary => Month.ToLower() == "february";
        public bool IsMarch => Month.ToLower() == "march";
        public bool IsApril => Month.ToLower() == "april";
        public bool IsMay => Month.ToLower() == "may";
        public bool IsJune => Month.ToLower() == "june";
        public bool IsJuly => Month.ToLower() == "july";
        public bool IsAugust => Month.ToLower() == "august";
        public bool IsSeptember => Month.ToLower() == "september";
        public bool IsOctober => Month.ToLower() == "october";
        public bool IsNovember => Month.ToLower() == "november";
        public bool IsDecember => Month.ToLower() == "december";

        public static int MonthNumber = 0;

        public static Dictionary<string, string> CategoryFilterValues =>
            new Dictionary<string, string> {
                { "class", "Class" },
                { "assignment", "Assignment" }
            };

        public bool IsClassSession => Category.ToLower() == "class";
        public bool IsAssignment => Category.ToLower() == "assignment";
    }
}
