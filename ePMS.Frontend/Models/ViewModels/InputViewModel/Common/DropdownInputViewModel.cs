using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class DropdownInputViewModel
    {
        public DropdownInputViewModel()
        {
            //var user = new TenantOutputViewModel();
            CompanyID = HttpContext.Current.Session["CompanyID"] == null ? 0 : int.Parse(HttpContext.Current.Session["CompanyID"].ToString());
            //if (HttpContext.Current.Session["Tenant"] != null)
            //{
            //    user = JsonConvert.DeserializeObject<TenantOutputViewModel>(HttpContext.Current.Session["Tenant"].ToString());
            //    CompanyID = user.CompanyID;
            //}

            //if (HttpContext.Current.Session["Landlord"] != null)
            //{
            //    user = JsonConvert.DeserializeObject<TenantOutputViewModel>(HttpContext.Current.Session["Landlord"].ToString());
            //    CompanyID = user.CompanyID;
            //}
        }
        [Required]
        public string Table { get; set; }
        public string Columns { get; set; }
        public string Condition { get; set; }
        public long? CompanyID { get; set; }
    }
}