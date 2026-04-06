using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Areas.UserManagement.Models.RoleRight
{
    public class RoleRightTableOutputViewModel :AuditableInputModel
    {
        

        public string Module { get; set; }
        public string SubModule { get; set; }

        public bool CanAdd { get; set; }
        public bool CanView { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
    }
}