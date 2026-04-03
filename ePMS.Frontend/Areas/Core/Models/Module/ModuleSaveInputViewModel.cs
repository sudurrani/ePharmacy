using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.Module
{
	public class ModuleSaveInputViewModel :AuditableInputModel
	{

        public string Description { get; set; }
        public string Detail { get; set; }
        public string ModuleUrl { get; set; }
        public string IconClass { get; set; }
        public string Priority { get; set; }



    }
}