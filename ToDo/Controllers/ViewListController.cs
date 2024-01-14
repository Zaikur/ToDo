using Microsoft.AspNetCore.Mvc;

namespace ToDo.Controllers
{
    public class ViewListController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
