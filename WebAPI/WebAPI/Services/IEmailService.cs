using WebAPI.Models;

namespace WebAPI.Services
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
