using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Admin
{
    /*
    GET   /api/admin/org-suspend-list
    PATCH /api/admin/org-suspend-list/{orgId}/suspend
    PATCH /api/admin/org-suspend-list/{orgId}/unlock
    */

    [ApiController]
    [Route("api/admin/org-suspend-list")]
    [Authorize(Roles = "Admin")]
    public class OrgSuspendListController : ControllerBase
    {
        private readonly IOrgSuspendListService _orgSuspendListService;
        private readonly ILogger<OrgSuspendListController> _logger;

        public OrgSuspendListController(
            IOrgSuspendListService orgSuspendListService,
            ILogger<OrgSuspendListController> logger)
        {
            _orgSuspendListService = orgSuspendListService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> ShowAllOrgs()
        {
            try
            {
                var orgs = await _orgSuspendListService.ShowAllOrgsAsync();
                return Ok(new { IsSuccess = true, Data = orgs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت لیست سازمان‌ها");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPatch("{orgId}/suspend")]
        public async Task<IActionResult> SuspendOrg(int orgId)
        {
            try
            {
                var result = await _orgSuspendListService.SuspendOrgAsync(orgId);

                if (!result)
                {
                    return BadRequest(new { IsSuccess = false, Message = "سازمان یافت نشد یا قبلاً تعلیق شده است." });
                }

                return Ok(new { IsSuccess = true, Message = "سازمان با موفقیت تعلیق شد." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در تعلیق سازمان {OrgId}", orgId);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPatch("{orgId}/unlock")]
        public async Task<IActionResult> UnlockOrg(int orgId)
        {
            try
            {
                var result = await _orgSuspendListService.UnlockOrgAsync(orgId);

                if (!result)
                {
                    return BadRequest(new { IsSuccess = false, Message = "سازمان یافت نشد یا در حالت تعلیق نیست." });
                }

                return Ok(new { IsSuccess = true, Message = "تعلیق سازمان با موفقیت رفع شد." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در رفع تعلیق سازمان {OrgId}", orgId);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}