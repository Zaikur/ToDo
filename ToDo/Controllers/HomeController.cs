using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using ToDo.Models;

namespace ToDo.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private EventContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, EventContext ctx)
        {
            _logger = logger;

            _context = ctx;
        }

        [HttpPost]
        public IActionResult Filter(string[] filter)
        {

            string id = string.Join('-', filter);
            return RedirectToAction("List", new { ID = id });
        }

        public IActionResult Index()
        {
            return RedirectToAction("List");
        }

        public IActionResult List(string id)
        {
            var filters = new Filters(id);
            ViewBag.Filters = filters;
            ViewBag.Categories = Filters.CategoryFilterValues;
            ViewBag.Months = Filters.MonthFilterValues;

            IQueryable<EventModel> query = _context.Events;
            if (filters.HasCategory)
            {
                if (filters.IsClassSession)
                {
                    query = query.Where(t => t.EventType == "Class-Session");
                } else
                {
                    query = query.Where(t => t.EventType == filters.Category);
                }
            }
            if (filters.HasMonth)
            {
                if (filters.IsJanuary)
                    query = query.Where(u => u.StartDate.Month == 1);
                else if (filters.IsFebruary)
                    query = query.Where(u => u.StartDate.Month == 2);
                else if (filters.IsMarch)
                    query = query.Where(u => u.StartDate.Month == 3);
                else if (filters.IsApril)
                    query = query.Where(u => u.StartDate.Month == 4);
                else if (filters.IsMay)
                    query = query.Where(u => u.StartDate.Month == 5);
                else if (filters.IsJune)
                    query = query.Where(u => u.StartDate.Month == 6);
                else if (filters.IsJuly)
                    query = query.Where(u => u.StartDate.Month == 7);
                else if (filters.IsAugust)
                    query = query.Where(u => u.StartDate.Month == 8);
                else if (filters.IsSeptember)
                    query = query.Where(u => u.StartDate.Month == 9);
                else if (filters.IsOctober)
                    query = query.Where(u => u.StartDate.Month == 10);
                else if (filters.IsNovember)
                    query = query.Where(u => u.StartDate.Month == 11);
                else if (filters.IsDecember)
                    query = query.Where(u => u.StartDate.Month == 12);
            }


            var events = query
                .OrderBy(e => e.StartDate)
                .ToList();

            return View(events);
        }

        public IActionResult Help()
        {
            return View();
        }

        public IActionResult Import()
        {
            return View();
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
