using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using Microsoft.VisualStudio.DebuggerVisualizers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ePMS.Frontend.Areas.UserManagement.Models.Role
{
    public class RoleSaveInputViewModel : AuditableInputModel
    {
     
        public string Description { get; set; }
       
    }
}
