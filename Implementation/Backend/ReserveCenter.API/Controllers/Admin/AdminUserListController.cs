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

        // These are called 'endpoints'
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminUserListService.GetAllUsersAsync();

            return Ok(users);
        }
    }
}
