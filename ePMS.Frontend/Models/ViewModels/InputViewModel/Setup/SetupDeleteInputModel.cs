using System.Web;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Setup
{
    public class SetupDeleteInputModel
    {
        public SetupDeleteInputModel()
        {
            UserID = int.Parse(HttpContext.Current.Session["UserID"].ToString());
        }
        public int ID { get; set; }
        public int UserID { get; set; }
        public string Table { get; set; }
    }
}