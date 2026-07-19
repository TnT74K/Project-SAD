using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Admin
{
    [ApiController]
    [Route("api/org/admin/approval-list")]
    [Authorize(Roles = "Admin")]
    public class OrgApprovalListController : ControllerBase
    {
        private readonly IOrgApprovalListService _orgApprovalListService;
        private readonly ILogger<OrgApprovalListController> _logger;

        public OrgApprovalListController(
            IOrgApprovalListService orgApprovalListService,
            ILogger<OrgApprovalListController> logger)
        {
            _orgApprovalListService = orgApprovalListService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUnregisteredOrgs()
        {
            try
            {
                var result = await _orgApprovalListService.GetAllUnregisteredOrgListAsync();
                return Ok(new { IsSuccess = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت لیست سازمان‌های در انتظار تایید");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _orgApprovalListService.GetByIdAsync(id);
                return Ok(new { IsSuccess = true, Data = result });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت جزئیات سازمان در انتظار تایید {OrgId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveOrg(int id)
        {
            try
            {
                var result = await _orgApprovalListService.ApprovalOrgAsync(id);

                if (result)
                    return Ok(new { IsSuccess = true, Message = "سازمان با موفقیت تایید شد." });

                return BadRequest(new { IsSuccess = false, Message = "خطا در تایید سازمان." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در تایید سازمان {OrgId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectOrg(int id)
        {
            try
            {
                var result = await _orgApprovalListService.RejectOrgAsync(id);

                if (result)
                    return Ok(new { IsSuccess = true, Message = "درخواست سازمان با موفقیت رد شد." });

                return BadRequest(new { IsSuccess = false, Message = "خطا در رد درخواست سازمان." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در رد سازمان {OrgId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchPhrase, [FromQuery] OrgTypeEnum orgTypeEnum = OrgTypeEnum.All)
        {
            try
            {
                var result = await _orgApprovalListService.SearchAsync(searchPhrase, orgTypeEnum);
                return Ok(new { IsSuccess = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در جستجوی سازمان‌های در انتظار تایید");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}