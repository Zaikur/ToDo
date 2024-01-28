using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ToDo.Models;

namespace ToDo.Controllers
{
    public class ActionsController : Controller
    {
        private EventContext _context;

        public ActionsController(EventContext ctx)
        {
            _context = ctx;
        }

        [HttpGet]
        public IActionResult Add()
        {
            ViewBag.Action = "Add";
            return View("AddUpdate");
        }

        [HttpGet]
        public IActionResult Update(int id)
        {
            ViewBag.Action = "Update";
            var task = _context.Events.Find(id);
            return View("AddUpdate", task);
        }

        [HttpPost]
        public IActionResult UpdateTask(EventModel task)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (ModelState.IsValid)
            {
                if (task.Id == 0)
                {
                    if (string.IsNullOrEmpty(userId)) return Forbid();
                    task.User = userId;
                    _context.Events.Add(task);
                }
                else
                {
                    if (userId != task.User) return Forbid();
                    _context.Events.Update(task);
                }
                _context.SaveChanges();
                return RedirectToAction("List", "Home");
            }
            else
            {
                ViewBag.Action = "Save";
                return View("AddUpdate");
            }
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            EventModel task = _context.Events.Find(id);
            return View(task);
        }

        [HttpPost]
        public IActionResult DeleteTask(EventModel task)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            if (userId != task.User) return Forbid();
            _context.Events.Remove(task);
            _context.SaveChanges();
            return RedirectToAction("List", "Home");
        }
    }
}
