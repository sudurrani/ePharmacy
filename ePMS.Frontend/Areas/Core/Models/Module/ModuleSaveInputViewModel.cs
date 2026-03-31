using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.Module
{
	public class ModuleSaveInputViewModel
	{
        public long Id { get; set; }

        public string Description { get; set; }

        public string Details { get; set; }

        public string ModuleUrl { get; set; }

        public string IconClass { get; set; }

        public int Priority { get; set; }

        public long CompanyId { get; set; }

        public long BranchId { get; set; }

        public long  CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public long LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public long DeletedBy { get; set; }

        public DateTime DeletedDate { get; set; }

        public bool IsDeleted { get; set; }

    }
}