using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Org.Appointment;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentListController : ControllerBase
    {
        private readonly IAppointmentListService _appointmentListService;
        private readonly IOrgService _orgService;
        private readonly ILogger<AppointmentListController> _logger;

        public AppointmentListController(
            IAppointmentListService appointmentListService,
            IOrgService orgService,
            ILogger<AppointmentListController> logger)
        {
            _appointmentListService = appointmentListService;
            _orgService = orgService;
            _logger = logger;
        }

        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در یک تاریخ خاص
        /// </summary>
        [HttpGet("org/{orgId}/date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDate(int orgId, string date)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var isOwner = await _orgService.IsOrgOwnerAsync(orgId, userId);
            var isAdmin = User.IsInRole("SuperAdmin") || User.IsInRole("OrgAdmin");
            
            if (!isOwner && !isAdmin)
            {
                return Forbid("شما دسترسی به مشاهده نوبت‌های این سازمان را ندارید");
            }

            if (!DateOnly.TryParse(date, out var appointmentDate))
            {
                return BadRequest(new { IsSuccess = false, Message = "فرمت تاریخ نامعتبر است" });
            }

            var result = await _appointmentListService.GetAppointmentsByDateAsync(orgId, appointmentDate);
            
            return Ok(new { IsSuccess = true, Data = result });
        }

        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در بازه زمانی
        /// </summary>
        [HttpGet("org/{orgId}/range")]
        public async Task<IActionResult> GetAppointmentsByDateRange(
            int orgId, 
            [FromQuery] string startDate, 
            [FromQuery] string endDate)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var isOwner = await _orgService.IsOrgOwnerAsync(orgId, userId);
            var isAdmin = User.IsInRole("SuperAdmin") || User.IsInRole("OrgAdmin");
            
            if (!isOwner && !isAdmin)
            {
                return Forbid("شما دسترسی به مشاهده نوبت‌های این سازمان را ندارید");
            }

            if (!DateOnly.TryParse(startDate, out var start) || !DateOnly.TryParse(endDate, out var end))
            {
                return BadRequest(new { IsSuccess = false, Message = "فرمت تاریخ نامعتبر است" });
            }

            if (start > end)
            {
                return BadRequest(new { IsSuccess = false, Message = "تاریخ شروع باید قبل از تاریخ پایان باشد" });
            }

            var result = await _appointmentListService.GetAppointmentsByDateRangeAsync(orgId, start, end);
            
            return Ok(new { IsSuccess = true, Data = result });
        }

        /// <summary>
        /// دریافت جزئیات یک نوبت
        /// </summary>
        [HttpGet("{appointmentId}")]
        public async Task<IActionResult> GetAppointmentById(int appointmentId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var appointment = await _appointmentListService.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound(new { IsSuccess = false, Message = "نوبت یافت نشد" });
            }

            var isOwner = await _orgService.IsOrgOwnerAsync(appointment.OrgId, userId);
            var isAdmin = User.IsInRole("SuperAdmin") || User.IsInRole("OrgAdmin");
            var isBooker = appointment.BookingUserId == userId;

            if (!isOwner && !isAdmin && !isBooker)
            {
                return Forbid("شما دسترسی به مشاهده این نوبت را ندارید");
            }

            return Ok(new { IsSuccess = true, Data = appointment });
        }

        /// <summary>
        /// به‌روزرسانی وضعیت نوبت
        /// </summary>
        [HttpPut("update-status")]
        public async Task<IActionResult> UpdateAppointmentStatus([FromBody] UpdateStatusRequest request)
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

            var appointment = await _appointmentListService.GetAppointmentByIdAsync(request.AppointmentId);
            if (appointment == null)
            {
                return NotFound(new { IsSuccess = false, Message = "نوبت یافت نشد" });
            }

            var isOwner = await _orgService.IsOrgOwnerAsync(appointment.OrgId, userId);
            var isStaff = User.IsInRole("Staff") || User.IsInRole("OrgAdmin");
            
            if (!isOwner && !isStaff)
            {
                return Forbid("شما دسترسی به تغییر وضعیت این نوبت را ندارید");
            }

            var result = await _appointmentListService.UpdateAppointmentStatusAsync(request, userId);
            
            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "خطا در تغییر وضعیت نوبت" });
            }

            return Ok(new { IsSuccess = true, Message = "وضعیت نوبت با موفقیت تغییر کرد" });
        }

        /// <summary>
        /// لغو نوبت
        /// </summary>
        [HttpPost("{appointmentId}/cancel")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            var appointment = await _appointmentListService.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound(new { IsSuccess = false, Message = "نوبت یافت نشد" });
            }

            var isOwner = await _orgService.IsOrgOwnerAsync(appointment.OrgId, userId);
            var isStaff = User.IsInRole("Staff") || User.IsInRole("OrgAdmin");
            var isBooker = appointment.BookingUserId == userId;
            
            if (!isOwner && !isStaff && !isBooker)
            {
                return Forbid("شما دسترسی به لغو این نوبت را ندارید");
            }

            var result = await _appointmentListService.CancelAppointmentAsync(appointmentId, userId);
            
            if (!result)
            {
                return BadRequest(new { IsSuccess = false, Message = "خطا در لغو نوبت" });
            }

            return Ok(new { IsSuccess = true, Message = "نوبت با موفقیت لغو شد" });
        }

        /// <summary>
        /// دریافت نوبت‌های امروز یک سازمان
        /// </summary>
        [HttpGet("org/{orgId}/today")]
        public async Task<IActionResult> GetTodayAppointments(int orgId)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            return await GetAppointmentsByDate(orgId, today.ToString("yyyy-MM-dd"));
        }

        /// <summary>
        /// دریافت نوبت‌های فردا یک سازمان
        /// </summary>
        [HttpGet("org/{orgId}/tomorrow")]
        public async Task<IActionResult> GetTomorrowAppointments(int orgId)
        {
            var tomorrow = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
            return await GetAppointmentsByDate(orgId, tomorrow.ToString("yyyy-MM-dd"));
        }
    }
}