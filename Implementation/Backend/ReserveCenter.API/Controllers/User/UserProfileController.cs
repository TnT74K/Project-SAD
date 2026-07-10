using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.User;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.User
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;
        private readonly ILogger<UserProfileController> _logger;

        public UserProfileController(
            IUserProfileService userProfileService,
            ILogger<UserProfileController> logger)
        {
            _userProfileService = userProfileService;
            _logger = logger;
        }

        /// <summary>
        /// دریافت پروفایل کاربر فعلی
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var profile = await _userProfileService.GetUserProfileAsync(userId);

            if (profile == null)
            {
                return NotFound(new { IsSuccess = false, Message = "پروفایل کاربر یافت نشد" });
            }

            return Ok(new { IsSuccess = true, Data = profile });
        }

        /// <summary>
        /// دریافت پروفایل کاربر با شناسه (فقط برای ادمین)
        /// </summary>
        [HttpGet("profile/{userId}")]
        [Authorize(Roles = "SuperAdmin,OrgAdmin")]
        public async Task<IActionResult> GetUserProfileById(int userId)
        {
            var profile = await _userProfileService.GetUserProfileAsync(userId);

            if (profile == null)
            {
                return NotFound(new { IsSuccess = false, Message = "پروفایل کاربر یافت نشد" });
            }

            return Ok(new { IsSuccess = true, Data = profile });
        }

        /// <summary>
        /// ویرایش پروفایل کاربر فعلی
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateUserRequest request)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

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

            var result = await _userProfileService.UpdateUserProfileAsync(userId, request);

            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "خطا در ویرایش پروفایل. احتمالاً شماره تلفن تکراری است." });
            }

            return Ok(new { IsSuccess = true, Message = "پروفایل با موفقیت ویرایش شد" });
        }

        /// <summary>
        /// دریافت لیست نوبت‌های کاربر فعلی (همه)
        /// </summary>
        [HttpGet("appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var appointments = await _userProfileService.GetUserAppointmentsByStatusAsync(userId);

            return Ok(new { IsSuccess = true, Data = appointments });
        }

        /// <summary>
        /// دریافت لیست نوبت‌های رزرو شده کاربر فعلی
        /// </summary>
        [HttpGet("appointments/reserved")]
        public async Task<IActionResult> GetMyReservedAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            // وضعیت 1 = جدید (رزرو شده)
            var appointments = await _userProfileService.GetUserAppointmentsByStatusAsync(userId, 1);

            return Ok(new { IsSuccess = true, Data = appointments });
        }

        /// <summary>
        /// دریافت لیست نوبت‌های انجام شده کاربر فعلی
        /// </summary>
        [HttpGet("appointments/done")]
        public async Task<IActionResult> GetMyDoneAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            // وضعیت 4 = انجام شده
            var appointments = await _userProfileService.GetUserAppointmentsByStatusAsync(userId, 4);

            return Ok(new { IsSuccess = true, Data = appointments });
        }

        /// <summary>
        /// دریافت لیست نوبت‌های لغو شده کاربر فعلی
        /// </summary>
        [HttpGet("appointments/cancelled")]
        public async Task<IActionResult> GetMyCancelledAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            // وضعیت 3 = لغو شده
            var appointments = await _userProfileService.GetUserAppointmentsByStatusAsync(userId, 3);

            return Ok(new { IsSuccess = true, Data = appointments });
        }

        /// <summary>
        /// دریافت آمار نوبت‌های کاربر فعلی
        /// </summary>
        [HttpGet("appointments/stats")]
        public async Task<IActionResult> GetMyAppointmentStats()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var stats = await _userProfileService.GetUserAppointmentStatsAsync(userId);

            return Ok(new { IsSuccess = true, Data = stats });
        }

        /// <summary>
        /// لغو نوبت توسط کاربر فعلی
        /// </summary>
        [HttpPost("appointments/{appointmentId}/cancel")]
        public async Task<IActionResult> CancelMyAppointment(int appointmentId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var result = await _userProfileService.CancelAppointmentByUserAsync(appointmentId, userId);

            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "خطا در لغو نوبت. ممکن است نوبت متعلق به شما نباشد یا قابل لغو نباشد." });
            }

            return Ok(new { IsSuccess = true, Message = "نوبت با موفقیت لغو شد" });
        }

        /// <summary>
        /// دریافت جزئیات یک نوبت برای کاربر فعلی
        /// </summary>
        [HttpGet("appointments/{appointmentId}")]
        public async Task<IActionResult> GetMyAppointmentById(int appointmentId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var appointment = await _userProfileService.GetUserAppointmentByIdAsync(appointmentId, userId);

            if (appointment == null)
            {
                return NotFound(new { IsSuccess = false, Message = "نوبت یافت نشد یا متعلق به شما نیست" });
            }

            return Ok(new { IsSuccess = true, Data = appointment });
        }
    }
}