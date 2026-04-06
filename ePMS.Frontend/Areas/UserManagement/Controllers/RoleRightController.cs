using ePMS.Frontend.Areas.UserManagement.Models.Role;
using ePMS.Frontend.Areas.UserManagement.Models.RoleRight;
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

        [HttpPost]
        public async Task<ActionResult> Save(RoleRightTableInputViewModel roleRightSaveInputViewModel)
        {

            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<RoleRightTableInputViewModel>(roleRightSaveInputViewModel);
            _responseOutputDto = await _respository.Execute<object>("RoleRight_Save", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
            
        }
        [HttpPost]
        public async Task<ActionResult> GetAll(RoleRightTableInputViewModel roleRightTableInputViewModel)
        {  sqlDynamicParameters  = new SqlDynamicParameters();
             sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<RoleRightTableInputViewModel>(roleRightTableInputViewModel);
            _responseOutputDto = await _respository.GetMultipleAsync<RoleRightTableOutputViewModel>("RoleRight_GetAll", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetByID(IDInputViewModel iDInputViewModel)
        {
            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<IDInputViewModel>(iDInputViewModel);
            _responseOutputDto = await _respository.GetSingleAsync<RoleGetByIDOutputViewModel>("RoleRight_GetByID", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }


        public async Task<ActionResult> Delete(RecordIdUserIdInputModel roleRightGetByIDOutputViewModel)
        {
            var sqlDynamicParameters = new SqlDynamicParameters().GetSqlParameters<object>(roleRightGetByIDOutputViewModel);

            var _responseOutputDto = await _respository.Execute<object>("RoleRight_Delete", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }





    } 
}