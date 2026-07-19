using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Org;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrgController : ControllerBase
    {
        private readonly IOrgService _orgService;
        private readonly ILogger<OrgController> _logger;

        public OrgController(IOrgService orgService, ILogger<OrgController> logger)
        {
            _orgService = orgService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterOrg([FromBody] OrgRegisterRequest request)
        {
            try
            {
                // ✅ دریافت UserId از توکن
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(new { IsSuccess = false, Message = "کاربر یافت نشد" });
                }

                // اعتبارسنجی مدل
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

                // ثبت سازمان
                var result = await _orgService.RegisterOrgAsync(request, userId);
                return Ok(result);
            }
            //  مدیریت خطاها با BadRequest
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RegisterOrg");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}