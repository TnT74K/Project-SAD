using ReserveCenter.API.Models.DTOs.PublicOrgProfile;

namespace ReserveCenter.API.Services.Interfaces;

public interface IAppointmentService
{
    Task<List<FreeTimeDto>> GetFreeTimesAsync(
        int serviceId,
        DateOnly date);

    Task<AppointmentResultDto> ReserveAsync(
        AppointmentRequestDto dto);

    Task<AppointmentResultDto?> GetByTrackingCodeAsync(
        string trackingCode);

    Task<bool> ChangeStatusAsync(
        AppointmentTrackingDto dto);
}