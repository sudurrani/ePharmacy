namespace ePMS.Frontend.Models.ViewModels.InputViewModel.Setup
{
    public class SetupModalPartialViewModel : SetupSaveInputModel
    {
        public string Title { get; set; }
        public string DescriptionPlaceholder { get; set; }
        public string SaveButtonId { get; set; }
        public string SaveCallBackFunctionName { get; set; }
        public string NewRecordFunctionName { get; set; }
        public string FunctionToRefreshDataOnSuccess { get; set; }

    }
}