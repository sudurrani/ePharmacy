using ePMS.Frontend.Areas.Core.Models.Module;
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
    public class ModuleController : Controller
    {
        private Repository _respository = new Repository("ePharmacyConnection");
        SqlDynamicParameters sqlDynamicParameters;
        ResponseOutputDto _responseOutputDto = new ResponseOutputDto();


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
        public async Task<ActionResult> Save(ModuleSaveInputViewModel moduleSaveInputViewModel)
        {
              sqlDynamicParameters  = new SqlDynamicParameters();
             sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<ModuleSaveInputViewModel>(moduleSaveInputViewModel);
            _responseOutputDto = await _respository.Execute<object>("Module_Save",sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<JsonResult>  GetAll()
        {
          //  sqlDynamicParameters  = new SqlDynamicParameters();
           // sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<CompanyIDInputViewModel>(new CompanyIDInputViewModel());
            _responseOutputDto = await _respository.GetMultipleAsync<ModuleTableOutputViewModel>("Module_GetAll", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]

        public ActionResult GetByID()
        {
            return View();
        }


        [HttpPost]
        
        public async Task<ActionResult> Delete(RecordIdUserIdInputModel recordIdUserIdInputModel)
        {
            var sqlDynamicParameters = new SqlDynamicParameters().GetSqlParameters<object>(recordIdUserIdInputModel);

            var _responseOutputDto = await _respository.Execute<object>("Module_Delete", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }


    }
}
