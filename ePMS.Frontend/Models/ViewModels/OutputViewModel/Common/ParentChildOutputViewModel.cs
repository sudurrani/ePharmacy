namespace ePMS.Frontend.Models.ViewModels.OutputViewModel.Common
{
    public class ParentChildOutputViewModel
    {
        public long ParentID { get; set; }
        public string ParentName { get; set; }
        public long Value { get; set; }
        public string Text { get; set; }
        public long ParentIDFk { get; set; }
        public int ToBeAdded { get; set; }
    }
}