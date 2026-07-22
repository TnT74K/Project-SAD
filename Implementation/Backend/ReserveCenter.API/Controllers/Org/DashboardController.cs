using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Filters;
using ReserveCenter.API.Security;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/org/dashboard")]
    [Authorize(Roles = "Organization")]
    [RequireSameOrg]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly IOrgService _orgService;

        public DashboardController(
            IDashboardService dashboardService,
            IOrgService orgService)
        {
            _dashboardService = dashboardService;
            _orgService = orgService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value ??
                              User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("کاربر احراز هویت نشده است.");
            return int.Parse(userIdClaim);
        }

        private async Task<int> GetCurrentOrgIdAsync()
        {
            var userId = GetCurrentUserId();

            // دریافت تمام سازمان‌ها و پیدا کردن سازمانی که CreatedBy == userId
            var allOrgs = await _orgService.GetAllOrgWithDetailAsync();
            var org = allOrgs?.FirstOrDefault(o => o.CreatedBy == userId && !o.IsDeleted);

            if (org == null)
                throw new KeyNotFoundException("سازمانی برای این کاربر یافت نشد.");

            return org.Id;
        }

        /// <summary>
        /// دریافت داشبورد مدیریت سازمان
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var dashboard = await _dashboardService.GetOrgDashboardAsync(orgId);
                return Ok(new { IsSuccess = true, Data = dashboard });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
