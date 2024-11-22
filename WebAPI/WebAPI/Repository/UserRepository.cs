using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repository.IRepository;

namespace WebAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDBContext dbContext;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;

        public UserRepository(AppDBContext dbContext, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        public async Task<IEnumerable<User>> GetAllAsync(string? query = null, int? inactivityDays = null, int? pageNumber = 1, int? pageSize = 20)
        {
            //Query
            var users = dbContext.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                users = users.Where(x => x.PhoneNumber.Contains(query) || x.Email.Contains(query));
            }
            //Filtering
            if (inactivityDays.HasValue)
            {
                var allUsers = await users.ToListAsync();

                allUsers = allUsers.Where(x => !x.LastLogin.HasValue ||
                                               (DateTime.UtcNow - x.LastLogin.Value).Days >= inactivityDays.Value)
                                   .ToList();
                return allUsers;
            }

            //Pagination
            var skipResults = (pageNumber - 1) * pageSize;
            users = users.Skip(skipResults ?? 0).Take(pageSize ?? 20);


            return await users.ToListAsync();
        }

        public async Task<IActionResult> UpdateAsync(User user)
        {
            var existingUser = await dbContext.Users.FindAsync(user.Id);
            if (existingUser == null)
            {
                return new NotFoundObjectResult(new { message = "User not found" });
            }

            existingUser.IsActive = user.IsActive;
            existingUser.Email = user.Email;
            existingUser.UserName = user.UserName;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.LastLogin = user.LastLogin;

            await dbContext.SaveChangesAsync();

            return new OkObjectResult("User status updated successfully");
        }

        public async Task<User> GetUserByIdAsync(Guid id)
        {
            return await dbContext.Users.FindAsync(id);
        }

        public async Task<IActionResult> UpdateUserRoleAsync(Guid userId, string roleId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return new NotFoundObjectResult(new { status = "error", message = "User not found" });
            }

            var role = await roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return new NotFoundObjectResult(new { status = "error", message = "Role not found" });
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            var resultRemove = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!resultRemove.Succeeded)
            {
                return new BadRequestObjectResult(new { status = "error", message = "Failed to remove current roles" });
            }

            var resultAdd = await userManager.AddToRoleAsync(user, role.Name);
            if (!resultAdd.Succeeded)
            {
                return new BadRequestObjectResult(new { status = "error", message = "Failed to add new role" });
            }

            return new OkObjectResult(new { status = "success", message = "User role updated successfully" });
        }

        public async Task<int> GetCount()
        {
            return await dbContext.Users.CountAsync();
        }
    }
}