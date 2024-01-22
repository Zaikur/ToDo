using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using ToDo.Models;
using Microsoft.EntityFrameworkCore;

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

        public IActionResult List()
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

        [HttpGet]
        public IActionResult Add()
        {
            ViewBag.Action = "Add";
            return View("AddUpdate");
        }

        [HttpGet]
        public IActionResult Update()
        {
            ViewBag.Action = "Update";
            return View("AddUpdate");
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
