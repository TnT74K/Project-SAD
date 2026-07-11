using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Org.Staff;
using ReserveCenter.API.Services.Interfaces;
using System.Security.Claims;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/org/staff-list")]
    [Authorize]
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
            var orgId = User.FindFirst("OrgId")?.Value;
            var result = await _staffListService.GetAllStaffListListAsync(int.Parse(orgId));
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchPhrase)
        {
            var result = await _staffListService.SearchAsync(searchPhrase);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] StaffCreateRequest staffCreateRequest)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roleId = User.FindFirstValue(ClaimTypes.Role);
            var orgId = User.FindFirst("OrgId")?.Value;

            staffCreateRequest.CreatedBy = int.Parse(userId);
            staffCreateRequest.RoleId = int.Parse(roleId);
            staffCreateRequest.OrgId = int.Parse(orgId);

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

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] StaffUpdateRequest staffUpdateRequest)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roleId = User.FindFirstValue(ClaimTypes.Role);

            staffUpdateRequest.ModifiedBy = int.Parse(userId);
            staffUpdateRequest.RoleId = int.Parse(roleId);

            var result = await _staffListService.EditAsync(staffUpdateRequest);

            if (result == null || result.Id == 0)
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

        [HttpPatch("{staffListId}/change-status")]
        public async Task<IActionResult> ChangeStatus(int staffListId)
        {
            var result = await _staffListService.ChangeStatusAsync(staffListId);

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

        [HttpDelete("{staffListId}")]
        public async Task<IActionResult> Delete(int staffListId)
        {
            var result = await _staffListService.DeleteAsync(staffListId);

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
    }
}
