using Microsoft.AspNetCore.Mvc;

namespace ToDo.Controllers
{
    public class AddController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
