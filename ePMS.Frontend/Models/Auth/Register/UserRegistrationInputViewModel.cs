using ePMS.Frontend.Models.ViewModels.InputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ePMS.Frontend.Models.Auth.Register
{
    public class UserRegistrationInputViewModel : AuditableInputModel
    {
        public string PharmacyName { get; set; }
        public string ShortName { get; set; }
        public string RegistrationNo { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
        public string ContactNo { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Plan { get; set; } = string.Empty;
    }
}