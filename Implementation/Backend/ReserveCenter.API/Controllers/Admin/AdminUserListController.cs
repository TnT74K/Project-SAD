using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Services.Interfaces;
using ReserveCenter.API.Models.DTOs.Admin.UserManage;

namespace ReserveCenter.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUserListController : ControllerBase
    {
        private readonly IAdminUserListService _adminUserListService;
        private readonly ILogger<AdminUserListController> _logger;

        public AdminUserListController(
            IAdminUserListService adminUserListService,
            ILogger<AdminUserListController> logger)
        {
            _adminUserListService = adminUserListService;
            _logger = logger;
        }

        // Use: GET /api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _adminUserListService.GetAllUsersAsync();
                return Ok(new { IsSuccess = true, Data = users });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت لیست کاربران");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        // Use: GET /api/admin/users/15
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserDetail(int id)
        {
            try
            {
                var user = await _adminUserListService.GetUserDetailAsync(id);

                if (user is null)
                {
                    return NotFound(new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                return Ok(new { IsSuccess = true, Data = user });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت جزئیات کاربر {UserId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPut("{id}/block")]
        public async Task<IActionResult> BlockUser(int id)
        {
            try
            {
                var success = await _adminUserListService.BlockUserAsync(id);

                if (!success)
                {
                    return NotFound(new { IsSuccess = false, Message = "کاربر یافت نشد یا قبلاً مسدود شده است" });
                }

                return Ok(new { IsSuccess = true, Message = "کاربر با موفقیت مسدود شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در مسدود کردن کاربر {UserId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPut("{id}/unblock")]
        public async Task<IActionResult> UnblockUser(int id)
        {
            try
            {
                var success = await _adminUserListService.UnblockUserAsync(id);

                if (!success)
                {
                    return NotFound(new { IsSuccess = false, Message = "کاربر یافت نشد یا قبلاً رفع مسدودیت شده است" });
                }

                return Ok(new { IsSuccess = true, Message = "مسدودیت کاربر با موفقیت رفع شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در رفع مسدودیت کاربر {UserId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDetailDto userDto)
        {
            try
            {
                if (id != userDto.Id)
                {
                    return BadRequest(new { IsSuccess = false, Message = "شناسه در URL با بدنه درخواست مطابقت ندارد" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { IsSuccess = false, Message = string.Join(" | ", errors) });
                }

                var success = await _adminUserListService.UpdateUserAsync(userDto);

                if (!success)
                {
                    return NotFound(new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                return Ok(new { IsSuccess = true, Message = "اطلاعات کاربر با موفقیت بروزرسانی شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در بروزرسانی کاربر {UserId}", id);
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}