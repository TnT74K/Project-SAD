using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Appointment;
using ReserveCenter.API.Models.DTOs.User;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class UserProfileService : IUserProfileService
    {
        private readonly ReserveCenterDBContext _dbContext;
        private readonly IUserRepository _userRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly ILogger<UserProfileService> _logger;

        public UserProfileService(
            ReserveCenterDBContext dbContext,
            IUserRepository userRepository,
            IAppointmentRepository appointmentRepository,
            ILogger<UserProfileService> logger)
        {
            _dbContext = dbContext;
            _userRepository = userRepository;
            _appointmentRepository = appointmentRepository;
            _logger = logger;
        }

        /// <summary>
        /// دریافت پروفایل کاربر
        /// </summary>
        public async Task<UserProfileDto> GetUserProfileAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetWithDetailByIdAsync(userId);
                if (user == null)
                    return null;

                // دریافت نقش کاربر
                var role = await GetUserRoleAsync(userId);

                return new UserProfileDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    NationalCode = user.NationalCode,
                    ProfileImage = user.ProfileImage,
                    CityId = user.CityId,
                    CityName = user.City?.Name,
                    IsBlocked = user.IsBlocked,
                    IsDeleted = user.IsDeleted,
                    Role = role
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile for {UserId}", userId);
                return null;
            }
        }

        /// <summary>
        /// ویرایش پروفایل کاربر
        /// </summary>
        public async Task<bool> UpdateUserProfileAsync(int userId, UpdateUserRequest request)
        {
            try
            {
                var user = await _dbContext.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

                if (user == null)
                    return false;

                // بررسی تکراری نبودن شماره تلفن (به جز خود کاربر)
                var existingUser = await _dbContext.Users
                    .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber && u.Id != userId && !u.IsDeleted);

                if (existingUser != null)
                    return false;

                // به‌روزرسانی
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.NationalCode = request.NationalCode;
                user.CityId = request.CityId;
                user.ProfileImage = request.ProfileImage ?? user.ProfileImage;
                user.ModifiedBy = userId;
                user.ModifiedDate = DateTime.Now;

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile for {UserId}", userId);
                return false;
            }
        }

        /// <summary>
        /// دریافت لیست نوبت‌های کاربر بر اساس وضعیت
        /// </summary>
        public async Task<List<AppointmentDto>> GetUserAppointmentsByStatusAsync(int userId, int? statusId = null)
        {
            try
            {
                var query = _dbContext.Appointments
                    .AsNoTracking()
                    .Include(a => a.AppointmentStatus)
                    .Include(a => a.Org)
                    .Include(a => a.Orgservice)
                    .Where(a => a.BookingUserId == userId);

                if (statusId.HasValue)
                {
                    query = query.Where(a => a.AppointmentStatusId == statusId.Value);
                }

                var appointments = await query
                    .OrderByDescending(a => a.AppointmentDate)
                    .ThenByDescending(a => a.AppointmentTime)
                    .ToListAsync();

                return appointments.Select(a => MapToAppointmentDto(a)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user appointments for {UserId}", userId);
                return new List<AppointmentDto>();
            }
        }

        /// <summary>
        /// دریافت آمار نوبت‌های کاربر
        /// </summary>
        public async Task<UserAppointmentStatsDto> GetUserAppointmentStatsAsync(int userId)
        {
            try
            {
                var appointments = await _dbContext.Appointments
                    .AsNoTracking()
                    .Where(a => a.BookingUserId == userId)
                    .ToListAsync();

                // وضعیت‌ها بر اساس Constants/AppointmentStatus.cs
                // 1 = New (رزرو شده), 4 = Completed (انجام شده), 3 = Cancelled (لغو شده)
                var reserved = appointments.Count(a => a.AppointmentStatusId == 1 || a.AppointmentStatusId == 2);
                var done = appointments.Count(a => a.AppointmentStatusId == 4);
                var cancelled = appointments.Count(a => a.AppointmentStatusId == 3);

                return new UserAppointmentStatsDto
                {
                    ReservedCount = reserved,
                    DoneCount = done,
                    CancelledCount = cancelled,
                    TotalCount = appointments.Count
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointment stats for {UserId}", userId);
                return new UserAppointmentStatsDto();
            }
        }

        /// <summary>
        /// لغو نوبت توسط کاربر
        /// </summary>
        public async Task<bool> CancelAppointmentByUserAsync(int appointmentId, int userId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return false;

                // بررسی اینکه نوبت متعلق به کاربر باشد
                if (appointment.BookingUserId != userId)
                    return false;

                // بررسی اینکه نوبت قابل لغو باشد (فقط وضعیت رزرو شده قابل لغو است)
                if (appointment.AppointmentStatusId != 1 && appointment.AppointmentStatusId != 2)
                    return false;

                // وضعیت لغو شده = 3
                appointment.AppointmentStatusId = 3;

                return await _appointmentRepository.UpdateAsync(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling appointment {AppointmentId} by user {UserId}", appointmentId, userId);
                return false;
            }
        }

        /// <summary>
        /// دریافت جزئیات یک نوبت برای کاربر
        /// </summary>
        public async Task<AppointmentDto> GetUserAppointmentByIdAsync(int appointmentId, int userId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return null;

                // بررسی اینکه نوبت متعلق به کاربر باشد
                if (appointment.BookingUserId != userId)
                    return null;

                return MapToAppointmentDto(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointment {AppointmentId} for user {UserId}", appointmentId, userId);
                return null;
            }
        }

        /// <summary>
        /// بررسی وجود کاربر
        /// </summary>
        public async Task<bool> UserExistsAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user != null;
        }

        // ============================================================
        // متدهای کمکی
        // ============================================================

        private async Task<string> GetUserRoleAsync(int userId)
        {
            var staff = await _dbContext.StaffLists
                .Include(s => s.Role)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (staff != null && staff.Role != null)
            {
                return staff.Role.Name;
            }

            return "User";
        }

        private AppointmentDto MapToAppointmentDto(Appointment appointment)
        {
            return new AppointmentDto
            {
                Id = appointment.Id,
                OrgId = appointment.OrgId,
                OrgName = appointment.Org?.Name,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime,
                Price = appointment.Price,
                OrgserviceId = appointment.OrgserviceId,
                ServiceName = appointment.Orgservice?.Name,
                BookingUserId = appointment.BookingUserId,
                BookingConfirmCode = appointment.BookingConfirmCode,
                IsReserved = appointment.IsReserved,
                AppointmentStatusId = appointment.AppointmentStatusId,
                AppointmentStatus = appointment.AppointmentStatus?.Status
            };
        }
    }
}