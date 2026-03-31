using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class CompanyIDInputViewModel
    {
        public CompanyIDInputViewModel()
        {
            CompanyID = HttpContext.Current.Session["CompanyID"] == null ? 0 : int.Parse(HttpContext.Current.Session["CompanyID"].ToString());

            var branchID = HttpContext.Current.Session["BranchID"] == null ? "0" : HttpContext.Current.Session["BranchID"].ToString();
            if (branchID == "0" || branchID == "All")
                BranchID = null;
            else
                BranchID = int.Parse(branchID);
        }
        public int CompanyID { get; set; }
        public long? BranchID { get; set; }
    }
}