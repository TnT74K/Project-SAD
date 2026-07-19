using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.PublicOrgProfile;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers;

[ApiController]
[Route("api/public-org-profile")]
public class PublicOrgProfileController : ControllerBase
{
    private readonly IPublicOrgProfileService _publicOrgProfileService;
    private readonly IAppointmentService _appointmentService;

    public PublicOrgProfileController(
        IPublicOrgProfileService publicOrgProfileService,
        IAppointmentService appointmentService)
    {
        _publicOrgProfileService = publicOrgProfileService;
        _appointmentService = appointmentService;
    }

    /// <summary>
    /// اطلاعات کامل سازمان
    /// </summary>
    [HttpGet("{orgId}")]
    public async Task<IActionResult> GetOrgProfile(int orgId)
    {
        try
        {
            var result =
            await _publicOrgProfileService.GetOrgProfileAsync(orgId);

            if (result is null)
                return BadRequest(new { IsSuccess = false, Message = "پروفایل کسب و کار یافت نشد" });

            return Ok(result);
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// لیست خدمات سازمان
    /// </summary>
    [HttpGet("{orgId}/services")]
    public async Task<IActionResult> GetServices(int orgId)
    {
        try
        {
            var result =
            await _publicOrgProfileService.GetServicesAsync(orgId);

            return Ok(result);
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// لیست ساعات آزاد
    /// </summary>
    [HttpGet("services/{serviceId}/free-times/{date}")]
    public async Task<IActionResult> GetFreeTimes(
        int serviceId,
        DateOnly date)
    {
        try
        {
            var result =
            await _appointmentService.GetFreeTimesAsync(
                serviceId,
                date);

            return Ok(result);
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// ثبت نوبت
    /// </summary>
    [HttpPost("appointments")]
    public async Task<IActionResult> Reserve(
        [FromBody] AppointmentRequestDto dto)
    {
        try
        {
            var result =
            await _appointmentService.ReserveAsync(dto);

            return Ok(result);
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// دریافت اطلاعات نوبت با کد رهگیری
    /// </summary>
    [HttpGet("appointments/{trackingCode}")]
    public async Task<IActionResult> GetAppointment(
        string trackingCode)
    {
        try
        {
            var result =
            await _appointmentService.GetByTrackingCodeAsync(
                trackingCode);

            if (result is null)
                return BadRequest(new { IsSuccess = false, Message = "نوبتی یافت نشد" });

            return Ok(result);
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// تغییر وضعیت نوبت
    /// </summary>
    [HttpPut("appointments/status")]
    public async Task<IActionResult> ChangeStatus(
        [FromBody] AppointmentTrackingDto dto)
    {
        try
        {
            bool result =
            await _appointmentService.ChangeStatusAsync(dto);

            if (!result)
                return BadRequest(new { IsSuccess = false, Message = "نوبتی یافت نشد" });

            return Ok(new
            {
                Message = "Appointment status updated successfully."
            });
        }
        catch (Exception ex)
        {

            return BadRequest(new { IsSuccess = false, Message = ex.Message });
        }
    }
}