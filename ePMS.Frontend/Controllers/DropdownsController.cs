using ePMS.Frontend.CommonClasses;
using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ePMS.Frontend.Controllers
{
    //[Authorize]
    public class DropdownsController : Controller
    {
        private Repository _repository = new Repository("ePharmacyConnection");
        SqlDynamicParameters sqlDynamicParameters;
        ResponseOutputDto _responseOutputDto = new ResponseOutputDto();
        public async Task<JsonResult> Get(DropdownInputViewModel dropdownInputViewModel)
        {
            if (ModelState.IsValid)
            {
                //dropdownInputViewModel.Condition = dropdownInputViewModel.Condition == null ? "" : dropdownInputViewModel.Condition + " AND CompanyID " + Int64.Parse(HttpContext.Session["CompanyID"].ToString()) + "";
                sqlDynamicParameters = new SqlDynamicParameters();
                sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<DropdownInputViewModel>(dropdownInputViewModel);

                _responseOutputDto = await _repository.GetMultipleAsync<DropdownOutputViewModel>("Setup_Dropdowns_Get", sqlDynamicParameters);
                return Json(_responseOutputDto);
            }

            return Json(_responseOutputDto);
        }
        public async Task<JsonResult> GetStrings(DropdownInputViewModel dropdownInputViewModel)
        {
            if (ModelState.IsValid)
            {
                //dropdownInputViewModel.Condition = dropdownInputViewModel.Condition == null ? "" : dropdownInputViewModel.Condition + " AND CompanyID " + Int64.Parse(HttpContext.Session["CompanyID"].ToString()) + "";
                sqlDynamicParameters = new SqlDynamicParameters();
                sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<DropdownInputViewModel>(dropdownInputViewModel);

                _responseOutputDto = await _repository.GetMultipleAsync<DropdownStringOutputViewModel>("Setup_Dropdowns_Get", sqlDynamicParameters);
                return Json(_responseOutputDto);
            }

            return Json(_responseOutputDto);
        }
    }
}