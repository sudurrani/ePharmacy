using System;

namespace ePMS.Frontend.Models.ViewModels.OutputViewModel.Common
{
    public class ResponseOutputDto//<DtoType>  where DtoType : class
    {

        public bool IsSuccess { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
        public dynamic resultJSON { get; set; }

        public void Success<DtoType>(DtoType resultJSON, string message = null) where DtoType : class
        {
            this.IsSuccess = true;
            this.Status = "Success";
            this.Message = (message == null ? "Success" : message);
            this.resultJSON = resultJSON;
        }
        public void Error(Exception exception, string message = null)
        {
            this.IsSuccess = false;
            this.Status = "Error";
            this.Exception = exception.Message;
            this.Message = (message == null ? "An error occured while processing your request" : message);



        }
        public void InValid(string errors, string message = null)
        {
            this.IsSuccess = false;
            this.Status = "InValid";
            this.Exception = errors;
            this.Message = (message == null ? "An error occured while processing your request" : message);



        }
    }
}