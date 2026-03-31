using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class AuditableInputModel
    {
        public AuditableInputModel()
        {
            UserID = HttpContext.Current.Session["UserID"] == null ? 0 : int.Parse(HttpContext.Current.Session["UserID"].ToString());
            CompanyID = HttpContext.Current.Session["CompanyID"] == null ? 0 : int.Parse(HttpContext.Current.Session["CompanyID"].ToString());


            var branchID = HttpContext.Current.Session["BranchID"] == null ? "0" : HttpContext.Current.Session["BranchID"].ToString();
            if (branchID == "0" || branchID == "All")
                BranchID = null;
            else
                BranchID = int.Parse(branchID);

        }
        public int ID { get; set; }
        public int UserID { get; set; }
        public int CompanyID { get; set; }
        public int? BranchID { get; set; }

        //Already excluded below properties from SQL Parameters generation
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
    }
}