using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;

namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Setup
{
    public class SetupSaveInputModel : AuditableInputModel
    {

        public string Description { get; set; }
        public string Table { get; set; }
    }
}