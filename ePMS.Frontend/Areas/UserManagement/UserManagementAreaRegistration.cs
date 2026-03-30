using System.Web.Mvc;

namespace ePMS.Frontend.Areas.UserManagement
{
    public class UserManagementAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "UserManagement";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "UserManagement_default",
                "UserManagement/{controller}/{action}/{id}",
                 new { controller = "UserLogin", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}