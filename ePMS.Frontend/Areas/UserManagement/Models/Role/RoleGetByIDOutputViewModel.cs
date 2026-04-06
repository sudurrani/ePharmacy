using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.UserManagement.Models.Role
{
    public class RoleGetByIDOutputViewModel
    {
        public long ID { get; set; }
        public string Description { get; set; }
        public long CompanyID { get; set; }
        public long BranchID { get; set; }
    }
}