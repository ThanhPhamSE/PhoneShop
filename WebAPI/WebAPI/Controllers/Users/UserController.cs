using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.Users;

namespace WebAPI.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;

        public UserController(IUserRepository userRepository, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            this.userRepository = userRepository;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery]string? query = null,[FromQuery] int? inactivityDays = null,
            [FromQuery] int? pageNumber = null, [FromQuery] int? pageSize = null)
        {
            var users = await userRepository.GetAllAsync(query,inactivityDays,pageNumber,pageSize);
            var response = new List<UserViewModel>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);

                var userRoles = new List<UserRoleViewModel>();
                foreach (var roleName in roles)
                {
                    var role = await roleManager.FindByNameAsync(roleName);
                    if (role != null)
                    {
                        userRoles.Add(new UserRoleViewModel
                        {
                            RoleId = role.Id.ToString(),
                            RoleName = role.Name
                        });
                    }
                }

                response.Add(new UserViewModel
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    LastLogin = user.LastLogin,
                    IsActive = user.IsActive,
                    PhoneNumber = user.PhoneNumber,
                    Roles = userRoles
                });
            }

            return Ok(response);
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = roleManager.Roles.ToList();

            var roleViewModels = roles.Select(role => new UserRoleViewModel
            {
                RoleId = role.Id.ToString(), 
                RoleName = role.Name    
            }).ToList();

            return Ok(roleViewModels);
        }


        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(Guid id)
        {
            var user = await userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsActive = !user.IsActive;

            var result = await userRepository.UpdateAsync(user);

            return Ok(new { message = "User status updated successfully!" });
        }

        [HttpPut("update-role")]
        public async Task<IActionResult> UpdateRole([FromQuery] Guid userId,[FromQuery] string roleId)
        {
            var result = await userRepository.UpdateUserRoleAsync(userId, roleId);
            return result;
        }

        [HttpGet]
        [Route("count")]
        public async Task<IActionResult> GetUsersTotal()
        {
            var count = await userRepository.GetCount();
            return Ok(count);
        }
    }
}
