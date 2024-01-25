using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using System.Net.Http;
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
            if (ModelState.IsValid)
            {
                if (task.Id == 0)
                {
                    _context.Events.Add(task);
                }
                else
                {
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
            _context.Events.Remove(task);
            _context.SaveChanges();
            return RedirectToAction("List", "Home");
        }
    }
}
