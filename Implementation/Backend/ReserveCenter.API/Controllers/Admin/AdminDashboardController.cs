using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _adminDashboardService;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(
            IAdminDashboardService adminDashboardService,
            ILogger<AdminDashboardController> logger)
        {
            _adminDashboardService = adminDashboardService;
            _logger = logger;
        }

        /// <summary>
        /// دریافت داشبورد ادمین کل سیستم
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var dashboard = await _adminDashboardService.GetAdminDashboardAsync();
                return Ok(new { IsSuccess = true, Data = dashboard });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت داشبورد ادمین");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}