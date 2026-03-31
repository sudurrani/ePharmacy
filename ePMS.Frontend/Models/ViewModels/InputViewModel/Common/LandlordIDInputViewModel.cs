using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class LandlordIDInputViewModel
    {
        public LandlordIDInputViewModel()
        {
            var landlord = 0; // new PropertyOwnerOutputViewModel();
            if (HttpContext.Current.Session["UserID"] != null)
            {
                landlord = HttpContext.Current.Session["UserID"] == null ? 0 : int.Parse(HttpContext.Current.Session["UserID"].ToString());
            }
            LandlordID = landlord;
        }
        public int LandlordID { get; set; }
    }
}