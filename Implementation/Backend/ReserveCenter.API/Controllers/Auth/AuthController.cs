using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Auth;
using ReserveCenter.API.Services.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReserveCenter.API.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// ثبت‌نام کاربر جدید
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SignUpRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new TokenResponse
                {
                    IsSuccess = false,
                    Message = string.Join(" | ", errors)
                });
            }

            var result = await _authService.RegisterAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// ورود کاربر با شماره تلفن و رمز عبور
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new TokenResponse
                {
                    IsSuccess = false,
                    Message = string.Join(" | ", errors)
                });
            }

            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return BadRequest(new { IsSuccess = false, Message = "ورود ناموفق" });
            }

            return Ok(result);
        }

        /// <summary>
        /// درخواست بازیابی رمز عبور (ارسال OTP)
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { IsSuccess = false, Message = "شماره تلفن معتبر نیست" });
            }

            var result = await _authService.ForgotPasswordAsync(request.PhoneNumber);

            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "کاربر با این شماره تلفن یافت نشد" });
            }

            return Ok(new { IsSuccess = true, Message = "کد تأیید به شماره تلفن شما ارسال شد" });
        }

        /// <summary>
        /// تأیید کد OTP
        /// </summary>
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { IsSuccess = false, Message = "اطلاعات وارد شده معتبر نیست" });
            }

            var token = await _authService.VerifyOtpAsync(request.PhoneNumber, request.OtpCode);

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { IsSuccess = false, Message = "کد تأیید اشتباه است یا منقضی شده است" });
            }

            return Ok(new
            {
                IsSuccess = true,
                Message = "کد تأیید صحیح است",
                Token = token
            });
        }

        /// <summary>
        /// تنظیم رمز جدید با توکن OTP
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new
                {
                    IsSuccess = false,
                    Message = string.Join(" | ", errors)
                });
            }

            var result = await _authService.ResetPasswordAsync(
                request.PhoneNumber,
                request.OtpToken,
                request.NewPassword);

            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "خطا در تغییر رمز عبور. لطفاً مجدداً تلاش کنید." });
            }

            return Ok(new { IsSuccess = true, Message = "رمز عبور با موفقیت تغییر یافت" });
        }

        /// <summary>
        /// خروج از حساب کاربری
        /// </summary>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier); // This finds the user's Id from JWT
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            await _authService.LogoutAsync(userId);
            return Ok(new { IsSuccess = true, Message = "خروج با موفقیت انجام شد" });
        }

        /// <summary>
        /// اعتبارسنجی توکن فعلی
        /// </summary>
        [Authorize]
        [HttpGet("validate")]
        public IActionResult Validate()
        {
            return Ok(new { IsSuccess = true, Message = "توکن معتبر است" });
        }

        /// <summary>
        /// دریافت اطلاعات کاربر فعلی
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            // دریافت اطلاعات کامل کاربر از سرویس
            var user = await _authService.GetUserByIdAsync(userId);

            return Ok(new
            {
                IsSuccess = true,
                User = user
            });
        }
        // After login, the user chooses their role, and send this request to backend.
        [HttpPost("select-role")] // Call it "Controller action"
        public async Task<IActionResult> SelectRole([FromBody] RoleSelectionRequest request)
        {
            var result = await _authService.SelectRoleAsync(
                request.UserId,
                request.RoleName,
                request.OrgId);

            return Ok(result);
        }

        [HttpPost("send-role-id")] 
        public async Task<IActionResult> SendRoleId()
        {
            try
            {
                var role = User.FindFirstValue(ClaimTypes.Role);
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);


                // دریافت اطلاعات کامل کاربر از سرویس
                var user = await _authService.GetUserByIdAsync(int.Parse(userId));


                if (role == Constants.Roles.Staff)
                {
                    return Ok(new
                    {
                        IsSuccess = true,
                        RoleId = 4,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    });
                }
                else if (role == Constants.Roles.Support)
                {
                    return Ok(new
                    {
                        IsSuccess = true,
                        RoleId = 3,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    });
                }
                else if (role == Constants.Roles.OrgAdmin)
                {
                    return Ok(new
                    {
                        IsSuccess = true,
                        RoleId = 2,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    });
                }
                else if (role == Constants.Roles.SuperAdmin)
                {
                    return Ok(new
                    {
                        IsSuccess = true,
                        RoleId = 1,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    });
                }

                //customer
                return Ok(new
                {
                    IsSuccess = true,
                    RoleId = 5,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                });
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }
    }
}