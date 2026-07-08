using ReserveCenter.API.DatabaseModels;

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
}
