using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Org;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // همه متدها نیاز به احراز هویت دارند
    public class OrgController : ControllerBase
    {
        private readonly IOrgService _orgService;
        private readonly ILogger<OrgController> _logger;

        public OrgController(IOrgService orgService, ILogger<OrgController> logger)
        {
            _orgService = orgService;
            _logger = logger;
        }

        // ============================================================
        //  ثبت سازمان 
        // ============================================================
        [HttpPost("register")]
        public async Task<IActionResult> RegisterOrg([FromBody] OrgRegisterRequest request)
        {
            // 1. دریافت UserId از توکن
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { IsSuccess = false, Message = "کاربر یافت نشد" });
            }

            // 2. اعتبارسنجی مدل
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new
                {
                    IsSuccess = false,
                    Message = string.Join(" | ", errors)
                });
            }

            // 3. ثبت سازمان
            var result = await _orgService.RegisterOrgAsync(request, userId);

            if (!result.IsSuccess)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}