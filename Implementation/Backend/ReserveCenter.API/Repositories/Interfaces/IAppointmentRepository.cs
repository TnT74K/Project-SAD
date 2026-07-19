using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Appointment;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IAppointmentRepository
{
    //برای گرفتن یک نوبت بر اساس ای دی ان
    Task<Appointment?> GetByIdAsync(int appointmentId);

    Task<Appointment> AddAsync(Appointment appointment);

    Task<bool> UpdateAsync(Appointment appointment);

    Task<bool> DeleteAsync(int appintmentId);

    //برای گرفتن لیست نوبت های مربوط به کسب و کار مدنظر
    Task<List<Appointment>> AppointmentListByOrgIdAsync(int orgId);

    Task<List<Appointment>> GetByServiceAndDateAsync(int serviceId, DateOnly date);
    Task<Appointment?> GetByTrackingCodeAsync(string trackingCode);
    Task<Appointment?> GetConflictAppointmentAsync(int serviceId, DateOnly appointmentDate, TimeOnly appointmentTime);
    Task<List<Appointment>?> GetAppointmentsByDateAsync(int orgId, DateOnly date);
    Task<List<Appointment>?> GetAppointmentsByDateRangeAsync(int orgId, DateOnly startDate, DateOnly endDate);
}
