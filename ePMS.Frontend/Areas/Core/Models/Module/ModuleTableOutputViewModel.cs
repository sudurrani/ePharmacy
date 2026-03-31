using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.Module
{
	public class ModuleTableOutputViewModel
	{
        public long ID { get; set; }                     
        public string Description { get; set; }           
        public string? Detail { get; set; }               
        public string? ModuleUrl { get; set; }            // NULL
        public string? IconClass { get; set; }            // NULL
        public int Priority { get; set; }                 // NOT NULL
        public long CompanyID { get; set; }               // NOT NULL
        public long? BranchID { get; set; }               // NULL
        public long CreatedBy { get; set; }               
        public DateTime CreatedDate { get; set; }         
        public long? LastModifiedBy { get; set; }         
        public DateTime? LastModifiedDate { get; set; }   
        public long? DeletedBy { get; set; }              
        public DateTime? DeletedDate { get; set; }        
        public bool IsDeleted { get; set; }
    }
}