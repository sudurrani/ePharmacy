using ePMS.Frontend.Areas.Core.Models.SubModule;
using ePMS.Frontend.CommonClasses;
using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ePMS.Frontend.Areas.Core.Controllers
{
    public class SubModuleController : Controller
    {
        private Repository _respository = new Repository("ePharmacyConnection");
        SqlDynamicParameters sqlDynamicParameters;
        ResponseOutputDto _responseOutputDto= new ResponseOutputDto();

        [HttpGet]
        public ActionResult List()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Add()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Update() { 
            return View();
        }
        [HttpGet]
        public ActionResult Detial() {
            return View();
        }
        [HttpPost]
        public ActionResult Save( SubModuleSaveInputViewModelcs model)
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> GetAll( )
        {
             // sqlDynamicParameters  = new SqlDynamicParameters();
            // sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<CompanyIDInputViewModel>(companyIDInputViewModel);
            _responseOutputDto = await _respository.GetMultipleAsync<SubModuleTableOutputViewModel>("SubModule_GetAll", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetById()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Delete()
        {
            return View();
        }
    }
}
