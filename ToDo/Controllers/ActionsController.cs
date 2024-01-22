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

        [HttpGet]
        public IActionResult Delete()
        {
            return View();
        }
    }
}
