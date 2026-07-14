using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Admin
{
    [ApiController]
    [Route("api/org/admin/approval-list")]
    [Authorize]
    public class OrgApprovalListController : ControllerBase
    {
        private readonly IOrgApprovalListService _orgApprovalListService;

        public OrgApprovalListController(IOrgApprovalListService orgApprovalListService)
        {
            _orgApprovalListService = orgApprovalListService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUnregisteredOrgs()
        {
            var result = await _orgApprovalListService.GetAllUnregisteredOrgListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _orgApprovalListService.GetByIdAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveOrg(int id)
        {
            try
            {
                var result = await _orgApprovalListService.ApprovalOrgAsync(id);

                if (result)
                    return Ok(new { success = true, message = "سازمان با موفقیت تایید شد." });

                return BadRequest(new { success = false, message = "خطا در تایید سازمان." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectOrg(int id)
        {
            try
            {
                var result = await _orgApprovalListService.RejectOrgAsync(id);

                if (result)
                    return Ok(new { success = true, message = "درخواست سازمان با موفقیت رد شد." });

                return BadRequest(new { success = false, message = "خطا در رد درخواست سازمان." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchPhrase, [FromQuery] OrgTypeEnum orgTypeEnum = OrgTypeEnum.All)
        {
            var result = await _orgApprovalListService.SearchAsync(searchPhrase, orgTypeEnum);
            return Ok(result);
        }
    }
}
