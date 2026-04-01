using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.Core.Models.Module
{
	public class ModuleTableOutputViewModel
	{
        public long ID { get; set; }                     
        public string Name { get; set; }           
        public string Detail { get; set; }                 
        public decimal Priority { get; set; }                 
        public string EntryDate { get; set; }  
    }
}