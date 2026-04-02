using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.SubModule
{
    public class SubModuleTableOutputViewModel
    {
        
        
    public long ID { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }
        public bool IsParent { get; set; }

        public long? ParentID { get; set; }

        public int? MenuOrder { get; set; }
        public string IconClass { get; set; }

        public long? ModuleID { get; set; }

        //public long CreatedBy { get; set; }

        //public DateTime CreatedDate { get; set; }

        //public long? LastModifiedBy { get; set; }

        //public DateTime? LastModifiedDate { get; set; }

        //public long? DeletedBy { get; set; }
        //public DateTime? DeletedDate { get; set; }
        //public bool IsDeleted { get; set; }

    
}
}