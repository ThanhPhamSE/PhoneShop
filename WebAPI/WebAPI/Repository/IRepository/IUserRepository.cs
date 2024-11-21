using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

namespace WebAPI.Repository.IRepository
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync(string? query = null, int? inactivityDays = null, int? pageNumber = 1, int? pageSize = 20);
        Task<IActionResult> UpdateAsync(User user);
        Task<User> GetUserByIdAsync(Guid id);
        Task<IActionResult> UpdateUserRoleAsync(Guid userId, string roleId);
        Task<int> GetCount();
    }
}
