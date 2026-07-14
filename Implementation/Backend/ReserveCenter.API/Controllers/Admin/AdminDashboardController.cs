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

        public AdminDashboardController(IAdminDashboardService adminDashboardService)
        {
            _adminDashboardService = adminDashboardService;
        }

        /// <summary>
        /// دریافت داشبورد ادمین کل سیستم
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var dashboard = await _adminDashboardService.GetAdminDashboardAsync();
            return Ok(new { IsSuccess = true, Data = dashboard });
        }
    }
}