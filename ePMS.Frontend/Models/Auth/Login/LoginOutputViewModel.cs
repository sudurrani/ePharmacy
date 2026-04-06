namespace ePMS.Frontend.Models.Auth.Login
{
    public class LoginOutputViewModel
    {
        public long ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public long CompanyID { get; set; }
        public long BranchID { get; set; }

        public string CompanyName { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
    }
}