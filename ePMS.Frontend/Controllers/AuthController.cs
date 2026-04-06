using ePMS.Frontend.Areas.Core.Models.Module;
using ePMS.Frontend.CommonClasses;
using ePMS.Frontend.Models.Auth.Login;
using ePMS.Frontend.Models.Auth.Register;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ePMS.Frontend.Controllers
{
    public class AuthController : Controller
    {
        private Repository _respository = new Repository("ePharmacyConnection");
        SqlDynamicParameters sqlDynamicParameters;
        ResponseOutputDto _responseOutputDto = new ResponseOutputDto();
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> CheckEmail(DropdownOutputViewModel dropdownOutputViewModel)
        {
            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<DropdownOutputViewModel>(dropdownOutputViewModel);
            _responseOutputDto = await _respository.GetSingleAsync<DropdownOutputViewModel>("Check_Email", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> Login(LoginInputViewModel loginInputViewModel)
        {
            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<LoginInputViewModel>(loginInputViewModel);
            _responseOutputDto = await _respository.GetSingleAsync<LoginOutputViewModel>("User_Login", sqlDynamicParameters);

            Session["UserID"] = _responseOutputDto.resultJSON.ID.ToString();
            Session["CurrencyID"] = 3.ToString();
            Session["CompanyID"] = _responseOutputDto.resultJSON.CompanyID.ToString().ToString();            
            Session["ProjectID"] = _responseOutputDto.resultJSON.CompanyID.ToString().ToString();
            Session["BranchID"] = _responseOutputDto.resultJSON.BranchID.ToString().ToString();
            Session["UserName"] = _responseOutputDto.resultJSON.Name.ToString();
            Session["Uname"] = _responseOutputDto.resultJSON.Name.ToString();
            Session["CompanyName"] = _responseOutputDto.resultJSON.CompanyName.ToString();
            Session["LogoUrl"] = _responseOutputDto.resultJSON.LogoUrl.ToString();
            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Register()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> Register(UserRegistrationInputViewModel userRegistrationInputViewModel)
        {
            sqlDynamicParameters = new SqlDynamicParameters();
            sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<UserRegistrationInputViewModel>(userRegistrationInputViewModel);
            _responseOutputDto = await _respository.Execute<object>("User_Registration", sqlDynamicParameters);

            return Json(_responseOutputDto, JsonRequestBehavior.AllowGet);
        }

    }
}
