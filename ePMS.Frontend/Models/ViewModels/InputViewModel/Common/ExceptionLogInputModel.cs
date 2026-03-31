namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class ExceptionLogInputModel
    {
        public string Controller { get; set; }
        public string Action { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorStack { get; set; }
        public int UserID { get; set; }
        public int CompanyID { get; set; }
    }
}