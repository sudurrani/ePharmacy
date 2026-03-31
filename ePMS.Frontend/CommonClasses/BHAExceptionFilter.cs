using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System.Linq;
using System.Web.Mvc;

namespace ePMS.Frontend.CommonClasses
{
    public class BHAExceptionFilter : HandleErrorAttribute
    {


        public override void OnException(ExceptionContext exceptionContext)
        {

            if (!exceptionContext.ExceptionHandled)
            {
                Repository _repository = new Repository();

                int userID = exceptionContext.HttpContext.Session["UserID"] == null ? 0 : int.Parse(exceptionContext.HttpContext.Session["UserID"].ToString());
                int companyID = exceptionContext.HttpContext.Session["CompanyID"] == null ? 0 : int.Parse(exceptionContext.HttpContext.Session["CompanyID"].ToString());
                var sqlDynamicParameters = new SqlDynamicParameters();
                var exceptionLogInputModel = new ExceptionLogInputModel()
                {
                    Controller = exceptionContext.RouteData.Values["controller"].ToString(),
                    Action = exceptionContext.RouteData.Values["action"].ToString(),
                    ErrorMessage = exceptionContext.Exception.Message.ToString(),
                    ErrorStack = exceptionContext.Exception.StackTrace.ToString(),
                    CompanyID = companyID,
                    UserID = userID
                };
                exceptionLogInputModel.ErrorMessage = (exceptionLogInputModel.ErrorMessage.Length > 3400 ? exceptionLogInputModel.ErrorMessage.Substring(0, 3400) : exceptionLogInputModel.ErrorMessage);
                exceptionLogInputModel.ErrorStack = (exceptionLogInputModel.ErrorStack.Length > 3400 ? exceptionLogInputModel.ErrorStack.Substring(0, 3400) : exceptionLogInputModel.ErrorStack);
                sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<ExceptionLogInputModel>(exceptionLogInputModel);
                var result = _repository.ExecuteSync<ExceptionLogInputModel>("ErrorLog_Save", sqlDynamicParameters);

                string message = string.Empty;
                if (exceptionContext.RouteData.Values["action"].ToString().Contains("Delete"))
                    message = ERPMessages.Delete_Error;
                else if (exceptionContext.RouteData.Values["action"].ToString().Contains("Save") || exceptionContext.RouteData.Values["action"].ToString().Contains("Create"))
                    message = ERPMessages.Save_Error;
                else if (exceptionContext.RouteData.Values["action"].ToString().Contains("Update"))
                    message = ERPMessages.Update_Error;

                var _responseOutputDto = new ResponseOutputDto();
                _responseOutputDto.Error(exceptionContext.Exception, message);

                exceptionContext.Result = new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = _responseOutputDto
                };
                exceptionContext.ExceptionHandled = true;
            }
        }
    }

    public class ValidateModelStateFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!filterContext.Controller.ViewData.ModelState.IsValid)
            {
                var errorsArray = filterContext.Controller.ViewData.ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
                string errorMessage = null;
                var errors = errorsArray.Select(x => new { x.Errors }).ToList();
                foreach (var error in errors)
                {
                    errorMessage += errorMessage == null ? error.Errors[0].ErrorMessage : (", " + error.Errors[0].ErrorMessage);
                }
                //filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                Repository _repository = new Repository();

                int userID = int.Parse(filterContext.HttpContext.Session["UserID"].ToString());
                int companyID = int.Parse(filterContext.HttpContext.Session["CompanyID"].ToString());
                var sqlDynamicParameters = new SqlDynamicParameters();
                var exceptionLogInputModel = new ExceptionLogInputModel()
                {
                    Controller = filterContext.RouteData.Values["controller"].ToString(),
                    Action = filterContext.RouteData.Values["action"].ToString(),
                    ErrorMessage = errorMessage.ToString(),
                    ErrorStack = "",
                    CompanyID = companyID,
                    UserID = userID
                };
                exceptionLogInputModel.ErrorMessage = (exceptionLogInputModel.ErrorMessage.Length > 3400 ? exceptionLogInputModel.ErrorMessage.Substring(0, 3400) : exceptionLogInputModel.ErrorMessage);
                exceptionLogInputModel.ErrorStack = (exceptionLogInputModel.ErrorStack.Length > 3400 ? exceptionLogInputModel.ErrorStack.Substring(0, 3400) : exceptionLogInputModel.ErrorStack);
                sqlDynamicParameters = sqlDynamicParameters.GetSqlParameters<ExceptionLogInputModel>(exceptionLogInputModel);
                var result = _repository.ExecuteSync<ExceptionLogInputModel>("ErrorLog_Save", sqlDynamicParameters);

                string message = string.Empty;
                if (filterContext.RouteData.Values["action"].ToString().Contains("Delete"))
                    message = ERPMessages.Delete_Error;
                else if (filterContext.RouteData.Values["action"].ToString().Contains("Save") || filterContext.RouteData.Values["action"].ToString().Contains("Create"))
                    message = ERPMessages.Save_Error;
                else if (filterContext.RouteData.Values["action"].ToString().Contains("Update"))
                    message = ERPMessages.Update_Error;

                var _responseOutputDto = new ResponseOutputDto();
                _responseOutputDto.InValid(exceptionLogInputModel.ErrorMessage.ToString());

                filterContext.Result = new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = _responseOutputDto
                };
                //filterContext.ExceptionHandled = true;


            }
        }
    }
}
