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
        var result =
            await _publicOrgProfileService.GetOrgProfileAsync(orgId);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// لیست خدمات سازمان
    /// </summary>
    [HttpGet("{orgId}/services")]
    public async Task<IActionResult> GetServices(int orgId)
    {
        var result =
            await _publicOrgProfileService.GetServicesAsync(orgId);

        return Ok(result);
    }

    /// <summary>
    /// لیست ساعات آزاد
    /// </summary>
    [HttpGet("services/{serviceId}/free-times")]
    public async Task<IActionResult> GetFreeTimes(
        int serviceId,
        [FromQuery] DateOnly date)
    {
        var result =
            await _appointmentService.GetFreeTimesAsync(
                serviceId,
                date);

        return Ok(result);
    }

    /// <summary>
    /// ثبت نوبت
    /// </summary>
    [HttpPost("appointments")]
    public async Task<IActionResult> Reserve(
        [FromBody] AppointmentRequestDto dto)
    {
        var result =
            await _appointmentService.ReserveAsync(dto);

        return Ok(result);
    }

    /// <summary>
    /// دریافت اطلاعات نوبت با کد رهگیری
    /// </summary>
    [HttpGet("appointments/{trackingCode}")]
    public async Task<IActionResult> GetAppointment(
        string trackingCode)
    {
        var result =
            await _appointmentService.GetByTrackingCodeAsync(
                trackingCode);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// تغییر وضعیت نوبت
    /// </summary>
    [HttpPut("appointments/status")]
    public async Task<IActionResult> ChangeStatus(
        [FromBody] AppointmentTrackingDto dto)
    {
        bool result =
            await _appointmentService.ChangeStatusAsync(dto);

        if (!result)
            return NotFound();

        return Ok(new
        {
            Message = "Appointment status updated successfully."
        });
    }
}