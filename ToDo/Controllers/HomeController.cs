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
            return RedirectToAction("Index", new { ID = id });
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

            var events = _context.Events
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
