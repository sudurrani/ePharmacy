using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ePMS.Frontend.CommonClasses
{
    public class EmailSender
    {
        public async Task<ResponseOutputDto> Send(string receiverEmail, string emailSubject, string emailBody)
        {
            try
            {
                MailMessage mail = new MailMessage
                {
                    From = new MailAddress("invite8bha@gmail.com", "BHA Accountancy Services"),
                    Subject = emailSubject,
                    Body = emailBody,
                    IsBodyHtml = true
                };
                mail.To.Add(receiverEmail);

                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("invite8bha@gmail.com", "nodc txum bjdw cznd"),
                    EnableSsl = true
                };

                await smtp.SendMailAsync(mail);
                Console.WriteLine("Email sent successfully!");
                return new ResponseOutputDto()
                {
                    IsSuccess = true,
                    Message = $"Email sent to {receiverEmail} successfully",
                    Exception = null,
                    resultJSON = null
                };
            }
            catch (SmtpFailedRecipientException ex)
            {
                return new ResponseOutputDto()
                {
                    IsSuccess = false,
                    Message = $"The recipient email address '{receiverEmail}' was not found or is invalid.",
                    Exception = ex.InnerException?.Message ?? ex.Message,
                    resultJSON = null
                };
            }
            catch (SmtpException ex)
            {
                string friendlyMessage;

                if (ex.StatusCode == SmtpStatusCode.MailboxUnavailable)
                {
                    friendlyMessage = $"The email address '{receiverEmail}' does not exist or is unavailable.";
                }
                else if (ex.StatusCode == SmtpStatusCode.ClientNotPermitted)
                {
                    friendlyMessage = $"Your Gmail account is not allowed to send to this recipient.";
                }
                else
                {
                    friendlyMessage = "An SMTP error occurred while sending the email.";
                }

                return new ResponseOutputDto()
                {
                    IsSuccess = false,
                    Message = friendlyMessage,
                    Exception = ex.InnerException?.Message ?? ex.Message,
                    resultJSON = null
                };
            }
            catch (Exception ex)
            {
                // Fallback for any other unexpected error
                return new ResponseOutputDto()
                {
                    IsSuccess = false,
                    Message = "Email sending failed. Please try again.",
                    Exception = ex.InnerException?.Message ?? ex.Message,
                    resultJSON = null
                };
            }
        }
    }
}