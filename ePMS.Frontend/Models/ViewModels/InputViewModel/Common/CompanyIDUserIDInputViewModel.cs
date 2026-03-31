using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class CompanyIDUserIDInputViewModel
    {
        public CompanyIDUserIDInputViewModel()
        {
            var ab = System.Web.HttpContext.Current.Session;
            var HttpCO = HttpContext.Current.Session;
            UserID = int.Parse(HttpContext.Current.Session["UserID"].ToString());
            CompanyID = int.Parse(HttpContext.Current.Session["CompanyID"].ToString());
        }
        public long CompanyID { get; set; }
        public long UserID { get; set; }
    }
}