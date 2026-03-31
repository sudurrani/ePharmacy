using System.Web;

namespace ePMS.Frontend.Models.ViewModels
{
    public class RecordIdUserIdInputModel
    {
        public RecordIdUserIdInputModel()
        {
            UserID = int.Parse(HttpContext.Current.Session["UserID"].ToString());
        }
        public long ID { get; set; }
        public int UserID { get; set; }
    }
}