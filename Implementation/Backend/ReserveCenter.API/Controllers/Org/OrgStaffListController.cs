using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Filters;
using ReserveCenter.API.Models.DTOs.Org.Staff;
using ReserveCenter.API.Security;
using ReserveCenter.API.Services.Interfaces;
using System.Security.Claims;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/org/staff-list")]
    [Authorize]
    [RequireSameOrg]
    public class StaffListController : ControllerBase
    {
        private readonly IStaffListService _staffListService;

        public StaffListController(IStaffListService staffListService)
        {
            _staffListService = staffListService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var result = await _staffListService.GetAllStaffListListAsync(orgId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchPhrase)
        {
            try
            {
                var result = await _staffListService.SearchAsync(searchPhrase, User.GetRequiredOrgId());
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] StaffCreateRequest staffCreateRequest)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                var roleId = User.FindFirstValue(ClaimTypes.Role);
                var orgId = User.GetRequiredOrgId();

                staffCreateRequest.CreatedBy = userId;
                staffCreateRequest.RoleId = int.Parse(roleId);
                staffCreateRequest.OrgId = orgId;

                var result = await _staffListService.AddAsync(staffCreateRequest);

                if (result == null || result.Id == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ثبت کارمند انجام نشد."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "کارمند با موفقیت ثبت شد.",
                    data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] StaffUpdateRequest staffUpdateRequest)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                var roleId = User.FindFirstValue(ClaimTypes.Role);
                var orgId = User.GetRequiredOrgId();

                staffUpdateRequest.ModifiedBy = userId;
                staffUpdateRequest.RoleId = int.Parse(roleId);
                if (await _staffListService.EditAsync(staffUpdateRequest, orgId) is not { Id: > 0 } result)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ویرایش کارمند انجام نشد."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "اطلاعات کارمند با موفقیت ویرایش شد.",
                    data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPatch("{staffListId}/change-status")]
        public async Task<IActionResult> ChangeStatus(int staffListId)
        {
            try
            {
                var result = await _staffListService.ChangeStatusAsync(staffListId, User.GetRequiredOrgId());

                if (result)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "وضعیت کارمند با موفقیت تغییر کرد."
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "تغییر وضعیت کارمند انجام نشد."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpDelete("{staffListId}")]
        public async Task<IActionResult> Delete(int staffListId)
        {
            try
            {
                var result = await _staffListService.DeleteAsync(staffListId, User.GetRequiredOrgId());

                if (result)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "کارمند با موفقیت حذف شد."
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "حذف کارمند انجام نشد."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { IsSuccess = false, Message = ex.Message });
            }
            catch (Exception ex)
            {

                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
