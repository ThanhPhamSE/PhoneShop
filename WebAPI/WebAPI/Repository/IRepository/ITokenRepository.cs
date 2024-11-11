using Microsoft.AspNetCore.Identity;
using WebAPI.Models;

namespace WebAPI.Repository.IRepository
{
    public interface ITokenRepository
    {
        string CreateJwtToken(User user, List<string> roles);
    }
}
