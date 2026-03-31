using System;
using System.Web;
using System.Web.Mvc;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class IDCompanyUserInputViewModel
    {
        public IDCompanyUserInputViewModel()
        {
            var ab = System.Web.HttpContext.Current.Session;
            var HttpCO = HttpContext.Current.Session;
            UserID = int.Parse(HttpContext.Current.Session["UserID"].ToString());
            CompanyID = int.Parse(HttpContext.Current.Session["CompanyID"].ToString());
        }
        public long? ID { get; set; }
        public long CompanyID { get; set; }
        public long UserID { get; set; }


        public IDCompanyUserInputViewModel Get(string id, ControllerContext controllerContext)
        {

            if (id == null || id == "")
            {
                ID = 0;
            }
            else
            {
                ID = Int64.Parse(id);

            }
            int entryUserID = int.Parse(controllerContext.HttpContext.Session["UserID"].ToString());
            int companyID = int.Parse(controllerContext.HttpContext.Session["CompanyID"].ToString());
            int projectID = int.Parse(controllerContext.HttpContext.Session["ProjectID"].ToString());

            return new IDCompanyUserInputViewModel()
            {
                ID = ID,
                UserID = entryUserID,
                CompanyID = companyID,
            };
        }

        internal IDCompanyUserInputViewModel Get(object value, ControllerContext controllerContext)
        {
            throw new NotImplementedException();
        }
    }
}