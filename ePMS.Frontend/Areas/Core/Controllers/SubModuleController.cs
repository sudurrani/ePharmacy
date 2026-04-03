using ePMS.Frontend.Areas.Core.Models.Module;
using ePMS.Frontend.Areas.Core.Models.SubModule;
using ePMS.Frontend.CommonClasses;
using ePMS.Frontend.Models.ViewModels;
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
        
        public async Task<ActionResult> Save(SubModuleSaveInputViewModel submoduleSaveInputViewModel)
        {

            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<SubModuleSaveInputViewModel>(submoduleSaveInputViewModel);
            _responseOutputDto = await _respository.Execute<object>("SubModule_Save", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
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
        public async Task<JsonResult> GetByID(IDInputViewModel iDInputViewModel)
        {
            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<IDInputViewModel>(iDInputViewModel);
            _responseOutputDto = await _respository.GetSingleAsync<SubModuleGetByIDOutputViewModel>("SubModule_GetByID", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> Delete(RecordIdUserIdInputModel recordIdUserIdInputModel)
        {
            var sqlDynamicParameters = new SqlDynamicParameters().GetSqlParameters<object>(recordIdUserIdInputModel);

            var _responseOutputDto = await _respository.Execute<object>("SubModule_Delete", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
    }
}
