namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class DateTablePartialViewInputViewModel
    {
        public string TableIdAttr { get; set; }
        public dynamic TableOutputViewModel { get; set; }
        public bool Filterable { get; set; } = true;
        public bool IsShowAction { get; set; } = true;
    }
}