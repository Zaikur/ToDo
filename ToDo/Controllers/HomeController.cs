using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using ToDo.Models;
using Microsoft.EntityFrameworkCore;
using ToDoList.Models;

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

        public IActionResult Index()
        {
            return RedirectToAction("List");
        }

        public IActionResult List(string id)
        {

            var events = _context.Events
                .OrderBy(e => e.StartDate)
                .ToList();

            return View(events);
        }

        public IActionResult Help()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Filter(string[] filter)
        {
            string id = string.Join('-', filter);
            return RedirectToAction("Index", new { ID = id });
        }

        public IActionResult Import()
        {
            return View();
        }

        [HttpPost]
        public IActionResult UploadEvents(List<EventModel> events)
        {
            // Process the received events and add them to Microsoft Calendar
            return View("Success");
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
