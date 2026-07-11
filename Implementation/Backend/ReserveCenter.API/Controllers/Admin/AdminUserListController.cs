using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Services.Interfaces;
namespace ReserveCenter.API.Controllers.Admin
{
    [ApiController] // We'll put this on almost every API controller.
    [Route("api/admin/users")]
    public class AdminUserListController : ControllerBase
    {
        private readonly IAdminUserListService _adminUserListService;

        public AdminUserListController(IAdminUserListService adminUserListService)
        {
            _adminUserListService = adminUserListService;
        }

        // These methods are called 'endpoints'
        // Use: GET /api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminUserListService.GetAllUsersAsync();

            return Ok(users);
        }

        // Use: GET /api/admin/users/15
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserDetail(int id)
        {
            var user = await _adminUserListService.GetUserDetailAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}/block")]
        public async Task<IActionResult> BlockUser(int id)
        {
            var success = await _adminUserListService.BlockUserAsync(id);

            if (!success)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPut("{id}/unblock")]
        public async Task<IActionResult> UnblockUser(int id)
        {
            var success = await _adminUserListService.UnblockUserAsync(id);

            if (!success)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
