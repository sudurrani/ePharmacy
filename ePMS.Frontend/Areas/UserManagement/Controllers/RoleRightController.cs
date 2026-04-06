using ePMS.Frontend.Areas.UserManagement.Models.RoleRight;
using ePMS.Frontend.CommonClasses;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ePMS.Frontend.Areas.UserManagement.Controllers
{
    public class RoleRightController : Controller
    {
        private Repository _respository = new Repository("ePharmacyConnection");
        SqlDynamicParameters sqlDynamicParameters;
        ResponseOutputDto _responseOutputDto = new ResponseOutputDto();

        [HttpGet]
        public ActionResult List()
        {
            return View();
        }

        public ActionResult Save(RoleRightSaveInputViewModel roleRightSaveInputViewModel)
        {
            return View();
        }

        public ActionResult GetAll()
        {
            return View();
        }

        public ActionResult GetByID()
        {
            return View();
        }


        public ActionResult Delete()
        {
            return View();
        }




        
    } 
}