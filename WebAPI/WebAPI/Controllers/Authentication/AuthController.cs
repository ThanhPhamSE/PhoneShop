using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.Services;
using WebAPI.ViewModel;

namespace WebAPI.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IEmailService emailService;
        public AuthController(UserManager<User> userManager,
            ITokenRepository tokenRepository, IEmailService emailService)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.emailService = emailService;
        }

        //identityResult = await userManager.AddToRoleAsync(user, "User");



        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestViewModel registerUser)
        {
            var userExist = await userManager.FindByEmailAsync(registerUser.Email);
            if (userExist != null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "User already exists!");
            }

            User user = new()
            {
                Email = registerUser.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registerUser.UserName
            };

            var result = await userManager.CreateAsync(user, registerUser.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "User Failed to Create!");
            }

            await userManager.AddToRoleAsync(user, "User");

            //var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            //var confirmationLink = Url.Action(nameof(ConfirmEmail), "Auth", new { token, email = user.Email }, Request.Scheme);
            //if (string.IsNullOrEmpty(confirmationLink))
            //{
            //    return StatusCode(StatusCodes.Status500InternalServerError, $"{token}, {user.Email},{Request.Scheme},{Request.Host},{confirmationLink} Failed to generate confirmation link.");
            //}

            //var message = new Message(new string[] { user.Email! }, "Confirmation email link", confirmationLink);
            //emailService.SendEmail(message);

            //return StatusCode(StatusCodes.Status200OK, $"User Created & Email sent to {user.Email} Successfully!");

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/Auth/ConfirmEmail?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";
            if (string.IsNullOrEmpty(confirmationLink))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"{token}, {user.Email},{Request.Scheme},{Request.Host},{confirmationLink} Failed to generate confirmation link.");
            }

            var message = new Message(new string[] { user.Email! }, "Confirmation email link", confirmationLink);
            emailService.SendEmail(message);

            //return StatusCode(StatusCodes.Status200OK, $"User Created & Email sent to {user.Email} Successfully!");
            return Ok(new { message = $"User Created & Email sent to {user.Email} Successfully!" });

        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var result = await userManager.ConfirmEmailAsync(user, token);
                if (result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status200OK,
                        "Email Verified Successfully");
                }
            }
            return StatusCode(StatusCodes.Status500InternalServerError,
                        "This user doesn't exist!");
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestViewModel request)
        {
            var identityUser = await userManager.FindByEmailAsync(request.Email);

            if (identityUser is not null)
            {
                if (!identityUser.EmailConfirmed)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "Email not confirmed. Please check your email to confirm your account.");
                }

                var checkPasswordResult = await userManager.CheckPasswordAsync(identityUser, request.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(identityUser);

                    var jwtToken = tokenRepository.CreateJwtToken(identityUser, roles.ToList());


                    var response = new LoginResponseViewModel()
                    {
                        Email = request.Email,
                        Roles = roles.ToList(),
                        Token = jwtToken
                    };

                    return Ok(response);
                }
            }
            ModelState.AddModelError("", "Email or Password Incorrect");
            return ValidationProblem(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([Required] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                //var forgotPasswordLink = $"{Request.Scheme}://{Request.Host}/api/Auth/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";
                var forgotPasswordLink = $"http://localhost:4200/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";
                var message = new Message(new string[] { user.Email! }, "Confirmation email link", forgotPasswordLink);
                emailService.SendEmail(message);
                return Ok(new { message = $"Password Changed request is sent on Email  {user.Email}.Please Open your email & click the link!" });
            }
            return Ok(new { message = "Couldn't send link to email, please try again." });

        }

        [HttpGet("reset-password")]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPassword { Token = token, Email = email };
            return Ok(new { model });
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPassword)
        {
            var user = await userManager.FindByEmailAsync(resetPassword.Email);
            if (user != null)
            {
                var resetPassResult = await userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
                if (!resetPassResult.Succeeded)
                {
                    foreach (var error in resetPassResult.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return Ok(ModelState);
                }
                return Ok(new { message = $"Password has been changed" });
            }
            return Ok(new { message = "Couldn't send link to email, please try again." });

        }
    }
}