using System.Collections.Generic;

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

        public static Dictionary<string, string> CategoryFilterValues =>
            new Dictionary<string, string> {
                { "classtime", "Classtime" },
                { "assignment", "Assignment" }
            };

        public bool IsClasstime => Category.ToLower() == "classtime";
        public bool IsAssignment => Category.ToLower() == "assignment";
    }
}
