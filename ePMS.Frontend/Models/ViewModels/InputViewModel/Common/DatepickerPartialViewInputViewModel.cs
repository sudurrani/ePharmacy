namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Common
{
    public class DatepickerPartialViewInputViewModel
    {
        public string Label { get; set; }
        public string IdAttribute { get; set; }
        public bool IsRequired { get; set; } = false;
        public bool IsSetToday { get; set; } = false;
    }
}