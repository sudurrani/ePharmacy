using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.SubModule
{
    public class SubModuleSaveInputViewModelcs
    {
        public long ID { get; set; }             
        public string Description { get; set; }  
        public string Url { get; set; }       
        public bool IsParent{ get; set; } 
        public long ParentID { get; set; }   
        public int MenuOrder{ get; set; }
        public long IconClass { get; set; }
        public long ModuleID{ get; set; }   
    }
}
