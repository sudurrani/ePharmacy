using ePMS.Frontend.Areas.Core.Models.Module;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ePMS.Frontend.Areas.Core.Controllers
{
    public class ModuleController : Controller
    {
        [HttpGet]
        public ActionResult List()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Detail(int id)
        {
            return View();
        }

        [HttpGet]
        public ActionResult Add()
        {
            return View();
        }



        [HttpGet]
        public ActionResult Update(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Save(ModuleSaveInputViewModel model)
        {
            return View();
        }

        [HttpPost]

        public ActionResult GetAll(int id)
        {
            return View();
        }

        [HttpPost]

        public ActionResult GetByID(IDInputViewModel model)
        {
            return View();
        }


        [HttpPost]

        public ActionResult Delete( )
        {
            return View();
        }



    }
}
