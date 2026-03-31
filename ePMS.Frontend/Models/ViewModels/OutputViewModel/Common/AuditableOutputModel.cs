namespace ePMS.Frontend.Models.ViewModels.OutputViewModel.Common
{
    public class AuditableOutputModel
    {
        public int ID { get; set; }
        public string EntryDate { get; set; }
        public long EntryUserID { get; set; }
        public string EntryUserName { get; set; }
        public int CompanyID { get; set; }
    }
}