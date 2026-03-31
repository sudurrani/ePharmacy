using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace ePMS.Frontend.Models.ViewModels.OutputViewModel.Common
{
    public class OneFieldOutputViewModel //: AuditableOutputModel
    {
        public int ID { get; set; }
        public string Description { get; set; }

        [Display(Name = "Entry Date")]
        public string EntryDate { get; set; }

        [JsonIgnore]
        public long EntryUserID { get; set; }

        [Display(Name = "Entry User")]
        public string EntryUserName { get; set; }

        [JsonIgnore]
        public int CompanyID { get; set; }


    }
}