using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class IDCompanyIDInputViewModel
    {
        public long ID { get; set; }
        public IDCompanyIDInputViewModel()
        {
            CompanyID = HttpContext.Current.Session["CompanyID"] == null ? 0 : int.Parse(HttpContext.Current.Session["CompanyID"].ToString());
        }
        public int CompanyID { get; set; }
    }
}