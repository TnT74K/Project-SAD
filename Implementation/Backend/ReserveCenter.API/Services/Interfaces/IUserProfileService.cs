using ReserveCenter.API.Models.DTOs.User;
using ReserveCenter.API.Models.DTOs.Org.Appointment;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IUserProfileService
    {
        /// <summary>
        /// دریافت پروفایل کاربر
        /// </summary>
        Task<UserProfileDto> GetUserProfileAsync(int userId);

        /// <summary>
        /// ویرایش پروفایل کاربر
        /// </summary>
        Task<bool> UpdateUserProfileAsync(int userId, UpdateUserRequest request);

        /// <summary>
        /// دریافت لیست نوبت‌های کاربر بر اساس وضعیت
        /// </summary>
        Task<List<AppointmentDto>> GetUserAppointmentsByStatusAsync(int userId, int? statusId = null);

        /// <summary>
        /// دریافت آمار نوبت‌های کاربر
        /// </summary>
        Task<UserAppointmentStatsDto> GetUserAppointmentStatsAsync(int userId);

        /// <summary>
        /// لغو نوبت توسط کاربر
        /// </summary>
        Task<bool> CancelAppointmentByUserAsync(int appointmentId, int userId);

        /// <summary>
        /// دریافت جزئیات یک نوبت برای کاربر
        /// </summary>
        Task<AppointmentDto> GetUserAppointmentByIdAsync(int appointmentId, int userId);

        /// <summary>
        /// بررسی وجود کاربر
        /// </summary>
        Task<bool> UserExistsAsync(int userId);
    }
}