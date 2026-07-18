using ReserveCenter.API.Models.DTOs.Org.Appointment;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IAppointmentListService
    {
        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در یک تاریخ خاص
        /// </summary>
        Task<AppointmentListResponse> GetAppointmentsByDateAsync(int orgId, DateOnly date);

        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در بازه زمانی
        /// </summary>
        Task<AppointmentListResponse> GetAppointmentsByDateRangeAsync(int orgId, DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// دریافت جزئیات یک نوبت
        /// </summary>
        Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId);

        /// <summary>
        /// به‌روزرسانی وضعیت نوبت
        /// </summary>
        Task<bool> UpdateAppointmentStatusAsync(UpdateStatusRequest request, int userId);

        /// <summary>
        /// لغو نوبت
        /// </summary>
        Task<bool> CancelAppointmentAsync(int appointmentId, int userId);

        /// <summary>
        /// بررسی وجود نوبت
        /// </summary>
        Task<bool> AppointmentExistsAsync(int appointmentId);

        /// <summary>
        /// بررسی تعلق نوبت به سازمان
        /// </summary>
        Task<bool> IsAppointmentBelongToOrgAsync(int appointmentId, int orgId);

        // ============================================================
        //  متد جدید برای ایجاد نوبت
        // ============================================================
        
        /// <summary>
        /// ایجاد نوبت جدید (توسط مدیر سازمان)
        /// </summary>
        Task<AppointmentDto> CreateAppointmentAsync(int orgId, AppointmentCreateRequest request, int modifiedBy);
    }
}