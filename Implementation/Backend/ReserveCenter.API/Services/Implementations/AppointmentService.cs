using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.PublicOrgProfile;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IOrgRepository _orgRepository;
    private readonly IServiceRepository _serviceRepository;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IOrgRepository orgRepository,
        IServiceRepository serviceRepository)
    {
        _appointmentRepository = appointmentRepository;
        _orgRepository = orgRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<List<FreeTimeDto>> GetFreeTimesAsync(
        int serviceId,
        DateOnly date)
    {
        var service = await _serviceRepository.GetByIdAsync(serviceId);

        if (service is null)
            return new();

        var org = await _orgRepository.GetWithDetailsByIdAsync(service.OrgId);

        if (org is null)
            return new();

        var appointments =
            await _appointmentRepository.GetByServiceAndDateAsync(
                serviceId,
                date);

        List<FreeTimeDto> result = new();

        TimeOnly current = org.StartWorkTime;

        while (current.AddMinutes(service.TimeDuration) <= org.EndWorkTime)
        {
            TimeOnly end =
                current.AddMinutes(service.TimeDuration);

            bool inRest =
                current < org.EndRestTime &&
                end > org.StartRestTime;

            if (!inRest)
            {
                bool reserved =
                    appointments.Any(a =>
                        a.IsReserved &&
                        a.AppointmentTime == current);

                if (!reserved)
                {
                    result.Add(new FreeTimeDto
                    {
                        StartTime = current,
                        EndTime = end
                    });
                }
            }

            current = current.AddMinutes(service.TimeDuration);
        }

        return result;
    }

    public async Task<AppointmentResultDto> ReserveAsync(
        AppointmentRequestDto dto)
    {
        var service =
            await _serviceRepository.GetByIdAsync(dto.ServiceId);

        if (service is null)
            throw new Exception("Service not found.");

        var appointments =
            await _appointmentRepository.GetByServiceAndDateAsync(
                dto.ServiceId,
                dto.AppointmentDate);

        bool reserved =
            appointments.Any(a =>
                a.IsReserved &&
                a.AppointmentTime == dto.AppointmentTime);

        if (reserved)
            throw new Exception("Selected time is reserved.");

        string trackingCode =
            Guid.NewGuid()
                .ToString("N")
                .Substring(0, 10)
                .ToUpper();

        Appointment appointment = new()
        {
            OrgId = dto.OrgId,
            OrgserviceId = dto.ServiceId,
            BookingUserId = dto.UserId,
            AppointmentDate = dto.AppointmentDate,
            AppointmentTime = dto.AppointmentTime,
            BookingConfirmCode = trackingCode,
            AppointmentStatusId = 1,
            IsReserved = true,
            Price = dto.Price
        };

        appointment =
            await _appointmentRepository.AddAsync(appointment);

        return new AppointmentResultDto
        {
            AppointmentId = appointment.Id,
            TrackingCode = appointment.BookingConfirmCode,
            AppointmentDate = appointment.AppointmentDate,
            AppointmentTime = appointment.AppointmentTime,
            AppointmentStatusId = appointment.AppointmentStatusId ?? 0
        };
    }
    public async Task<AppointmentResultDto?> GetByTrackingCodeAsync(
    string trackingCode)
{
    var appointment =
        await _appointmentRepository.GetByTrackingCodeAsync(trackingCode);

    if (appointment is null)
        return null;

    return new AppointmentResultDto
    {
        AppointmentId = appointment.Id,
        TrackingCode = appointment.BookingConfirmCode,
        AppointmentDate = appointment.AppointmentDate,
        AppointmentTime = appointment.AppointmentTime,
        AppointmentStatusId = appointment.AppointmentStatusId ?? 0
    };
}

public async Task<bool> ChangeStatusAsync(
    AppointmentTrackingDto dto)
{
    var appointment =
        await _appointmentRepository.GetByTrackingCodeAsync(dto.TrackingCode);

    if (appointment is null)
        return false;

    appointment.AppointmentStatusId = dto.AppointmentStatusId;

    return await _appointmentRepository.UpdateAsync(appointment);
}
}