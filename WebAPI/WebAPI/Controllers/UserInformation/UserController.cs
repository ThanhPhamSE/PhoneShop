using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.UserInformation;

namespace WebAPI.Controllers.UserInformation
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserDetailRepository _userRepository;

        public UserController(IUserDetailRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("get-by-email")]
        public async Task<IActionResult> GetUserAndAddressByEmail(string email)
        {
            try
            {
                // Lấy thông tin user
                var user = await _userRepository.GetUserByEmail(email);
                if (user == null || user.UserId == Guid.Empty)
                {
                    return NotFound("User not found with the specified email.");
                }

                // Lấy thông tin địa chỉ của user
                var address = await _userRepository.GetAddressByUserId(user.UserId);

                // Tạo đối tượng phản hồi kết hợp thông tin user và address
                var result = new
                {
                    User = user,
                    Address = address
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("update-by-email")]
        public async Task<IActionResult> UpdateUserAndAddressByEmail(string email, [FromBody] UpdateUserAndAddressViewModel updateModel)
        {
            try
            {
                // Lấy thông tin user theo email
                var user = await _userRepository.GetUserByEmail(email);
                if (user == null || user.UserId == Guid.Empty)
                {
                    return NotFound("User not found with the specified email.");
                }

                // Cập nhật thông tin user
                var updatedUser = new UserViewModel
                {
                    UserId = user.UserId,
                    UserName = updateModel.UserName,
                    PhoneNumber = updateModel.PhoneNumber,
                };
                await _userRepository.UpdateUser(user.UserId, updatedUser);

                // Cập nhật thông tin địa chỉ
                var updatedAddress = new AddressViewModel
                {
                    City = updateModel.City,
                    District = updateModel.District,
                    Village = updateModel.Village,
                    Description = updateModel.Description,
                };
                await _userRepository.UpdateAddress(user.UserId, updatedAddress);

                return Ok(new { message = "User and address updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            try
            {
                if (model.NewPassword != model.ConfirmNewPassword)
                {
                    return BadRequest(new { message = "New password and confirm password do not match." });
                }

                var result = await _userRepository.ChangePassword(model.email, model.OldPassword, model.NewPassword);

                if (!result)
                {
                    return BadRequest(new { message = "Password change failed. Please check the information again." });
                }

                return Ok(new { message = "ChangePasswords updated successfully!" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // Thông báo lỗi từ logic
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }




    }
}
