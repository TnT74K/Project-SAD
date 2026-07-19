using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Filters;
using ReserveCenter.API.Models.DTOs.Org.Profile;
using ReserveCenter.API.Models.DTOs.Org.Service;
using ReserveCenter.API.Models.DTOs.Org.Staff;
using ReserveCenter.API.Security;
using ReserveCenter.API.Services.Interfaces;
using System.Security.Claims;

namespace ReserveCenter.API.Controllers.Org
{
    [ApiController]
    [Route("api/org/profile")]
    [Authorize(Roles = "Organization")]
    [RequireSameOrg]
    public class OrgProfileController : ControllerBase
    {
        private readonly IOrgProfileService _profileService;
        private readonly IServiceService _serviceService;

        public OrgProfileController(
            IOrgProfileService profileService,
            IServiceService serviceService)
        {
            _profileService = profileService;
            _serviceService = serviceService;
        }

        //  متدهای کمکی
        private int GetCurrentUserId()
        {
            return User.GetRequiredUserId();
        }

        private async Task<int> GetCurrentOrgIdAsync()
        {
            var orgId = User.GetRequiredOrgId();
            var profile = await _profileService.GetProfileByOrgIdAsync(orgId);
            return profile.Id;
        }

        //  بخش پروفایل
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var profile = await _profileService.GetProfileByOrgIdAsync(User.GetRequiredOrgId());
                return Ok(profile);
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
        public async Task<IActionResult> UpdateProfile([FromBody] OrgProfileEditRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var orgId = User.GetRequiredOrgId();
                var result = await _profileService.UpdateProfileAsync(orgId, userId, request);

                if (result)
                    return Ok(new { success = true, message = "پروفایل با موفقیت بروزرسانی شد." });

                return BadRequest(new { success = false, message = "خطا در بروزرسانی پروفایل." });
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

        //  بخش مدیریت خدمات
        [HttpGet("services")]
        public async Task<IActionResult> GetServices()
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var services = await _serviceService.GetServicesByOrgIdAsync(orgId);
                return Ok(services);
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

        [HttpGet("services/{serviceId}")]
        public async Task<IActionResult> GetServiceById(int serviceId)
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var service = await _serviceService.GetServiceByIdAsync(serviceId, orgId);
                return Ok(service);
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

        [HttpPost("services")]
        public async Task<IActionResult> CreateService([FromBody] ServiceCreateRequest request)
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var service = await _serviceService.CreateServiceAsync(orgId, request);
                return Ok(new { success = true, message = "خدمت با موفقیت ایجاد شد.", data = service });
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

        [HttpPut("services")]
        public async Task<IActionResult> UpdateService([FromBody] ServiceUpdateRequest request)
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var result = await _serviceService.UpdateServiceAsync(orgId, request);

                if (result)
                    return Ok(new { success = true, message = "خدمت با موفقیت بروزرسانی شد." });

                return BadRequest(new { success = false, message = "خطا در بروزرسانی خدمت." });
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

        [HttpDelete("services/{serviceId}")]
        public async Task<IActionResult> DeleteService(int serviceId)
        {
            try
            {
                var orgId = User.GetRequiredOrgId();
                var result = await _serviceService.DeleteServiceAsync(serviceId, orgId);

                if (result)
                    return Ok(new { success = true, message = "خدمت با موفقیت حذف شد." });

                return BadRequest(new { success = false, message = "خطا در حذف خدمت." });
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
