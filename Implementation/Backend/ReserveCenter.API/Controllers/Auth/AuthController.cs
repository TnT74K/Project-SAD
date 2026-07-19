using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Auth;
using ReserveCenter.API.Services.Interfaces;
using System.Linq;
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
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در ثبت‌نام کاربر");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// ورود کاربر با شماره تلفن و رمز عبور
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
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
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در ورود کاربر");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// درخواست بازیابی رمز عبور (ارسال OTP)
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در درخواست بازیابی رمز عبور");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// تأیید کد OTP
        /// </summary>
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request)
        {
            try
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
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در تأیید کد OTP");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// تنظیم رمز جدید با توکن OTP
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
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
                    request.NewPassword);

                if (!result)
                {
                    return BadRequest(new { IsSuccess = false, Message = "خطا در تغییر رمز عبور. لطفاً مجدداً تلاش کنید." });
                }

                return Ok(new { IsSuccess = true, Message = "رمز عبور با موفقیت تغییر یافت" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در تغییر رمز عبور");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// خروج از حساب کاربری
        /// </summary>
        /// منطق خروج از حساب کاربری تماماً در فرانت انجام می‌شود

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
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                // دریافت اطلاعات کامل کاربر از سرویس
                var user = await _authService.GetUserByIdAsync(userId);

                return Ok(new
                {
                    IsSuccess = true,
                    User = user
                });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت اطلاعات کاربر فعلی");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        // After login, the user chooses their role, and send this request to backend.
        [HttpPost("select-role")] // Call it "Controller action"
        public async Task<IActionResult> SelectRole([FromBody] RoleSelectionRequest request)
        {
            try
            {
                var result = await _authService.SelectRoleAsync(
                    request.UserId,
                    request.RoleName,
                    request.OrgId);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در انتخاب نقش کاربر");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("send-role-id")] 
        public async Task<IActionResult> SendRoleId()
        {
            try
            {
                var roleClaim = User.FindFirstValue(ClaimTypes.Role);
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out var parsedUserId))
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = "کاربر معتبر نیست" });
                }

                // دریافت اطلاعات کامل کاربر از سرویس
                var user = await _authService.GetUserByIdAsync(parsedUserId);

                var roleId = 5;
                if (!string.IsNullOrEmpty(roleClaim) &&
                    Enum.TryParse<ReserveCenter.API.Models.Enums.RoleEnum>(roleClaim, ignoreCase: true, out var role) &&
                    role != ReserveCenter.API.Models.Enums.RoleEnum.All)
                {
                    roleId = (int)role;
                }

                return Ok(new
                {
                    IsSuccess = true,
                    RoleId = roleId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت شناسه نقش");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
