using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Appointment;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class AppointmentListService : IAppointmentListService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AppointmentListService> _logger;

        public AppointmentListService(
            IAppointmentRepository appointmentRepository,
            IOrgRepository orgRepository,
            IServiceRepository serviceRepository,
            IUserRepository userRepository,
            ILogger<AppointmentListService> logger)
        {
            _appointmentRepository = appointmentRepository;
            _orgRepository = orgRepository;
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _logger = logger;
        }
        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در یک تاریخ خاص
        /// </summary>
        public async Task<AppointmentListResponse> GetAppointmentsByDateAsync(int orgId, DateOnly date)
        {
            try
            {
                var org = await _orgRepository.GetByIdAsync(orgId);
                if (org == null)
                {
                    return new AppointmentListResponse
                    {
                        TotalCount = 0,
                        Appointments = new List<AppointmentDto>()
                    };
                }

                var appointments = await _appointmentRepository.GetAppointmentsByDateAsync(orgId, date);

                var appointmentDtos = appointments.Select(a => MapToDto(a)).ToList();

                return new AppointmentListResponse
                {
                    TotalCount = appointmentDtos.Count,
                    Appointments = appointmentDtos
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointments for org {OrgId} on date {Date}", orgId, date);
                return new AppointmentListResponse
                {
                    TotalCount = 0,
                    Appointments = new List<AppointmentDto>()
                };
            }
        }

        /// <summary>
        /// دریافت لیست نوبت‌های یک سازمان در بازه زمانی
        /// </summary>
        public async Task<AppointmentListResponse> GetAppointmentsByDateRangeAsync(int orgId, DateOnly startDate, DateOnly endDate)
        {
            try
            {
                var org = await _orgRepository.GetByIdAsync(orgId);
                if (org == null)
                {
                    return new AppointmentListResponse
                    {
                        TotalCount = 0,
                        Appointments = new List<AppointmentDto>()
                    };
                }

                var appointments = await _appointmentRepository.GetAppointmentsByDateRangeAsync(orgId, startDate, endDate);

                var appointmentDtos = appointments.Select(a => MapToDto(a)).ToList();

                return new AppointmentListResponse
                {
                    TotalCount = appointmentDtos.Count,
                    Appointments = appointmentDtos
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointments for org {OrgId} from {StartDate} to {EndDate}",
                    orgId, startDate, endDate);
                return new AppointmentListResponse
                {
                    TotalCount = 0,
                    Appointments = new List<AppointmentDto>()
                };
            }
        }

        /// <summary>
        /// دریافت جزئیات یک نوبت
        /// </summary>
        public async Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return null;

                return MapToDto(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting appointment {AppointmentId}", appointmentId);
                return null;
            }
        }

        /// <summary>
        /// به‌روزرسانی وضعیت نوبت
        /// </summary>
        public async Task<bool> UpdateAppointmentStatusAsync(UpdateStatusRequest request, int userId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(request.AppointmentId);
                if (appointment == null)
                    return false;

                appointment.AppointmentStatusId = request.AppointmentStatusId;

                return await _appointmentRepository.UpdateAsync(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment status for {AppointmentId}", request.AppointmentId);
                return false;
            }
        }

        /// <summary>
        /// لغو نوبت
        /// </summary>
        public async Task<bool> CancelAppointmentAsync(int appointmentId, int userId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return false;

                // وضعیت لغو شده = 3
                appointment.AppointmentStatusId = 3;
                // ❌ ModifiedBy و ModifiedDate رو حذف می‌کنیم چون در مدل وجود ندارند

                return await _appointmentRepository.UpdateAsync(appointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling appointment {AppointmentId}", appointmentId);
                return false;
            }
        }

        /// <summary>
        /// بررسی وجود نوبت
        /// </summary>
        public async Task<bool> AppointmentExistsAsync(int appointmentId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            return appointment != null;
        }

        /// <summary>
        /// بررسی تعلق نوبت به سازمان
        /// </summary>
        public async Task<bool> IsAppointmentBelongToOrgAsync(int appointmentId, int orgId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
            if (appointment == null)
                return false;

            return appointment.OrgId == orgId;
        }
        public async Task<AppointmentDto> CreateAppointmentAsync(int orgId, AppointmentCreateRequest request, int modifiedBy)
        {
            try
            {
                // 1. بررسی وجود سازمان
                var org = await _orgRepository.GetByIdAsync(orgId);
                if (org == null)
                    throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

                // 2. بررسی وجود سرویس و تعلق آن به سازمان
                var service = await _serviceRepository.GetByIdAsync(orgId);
                if (service == null)
                    throw new KeyNotFoundException("سرویس مورد نظر یافت نشد یا به این سازمان تعلق ندارد.");

                // 3. بررسی تداخل زمانی
                var existingAppointment = await _appointmentRepository.GetConflictAppointmentAsync(request.OrgserviceId, request.AppointmentDate, request.AppointmentTime);

                if (existingAppointment != null)
                    throw new InvalidOperationException("زمان انتخاب شده قبلاً رزرو شده است.");

                // 4. بررسی محدوده کاری سازمان
                if (request.AppointmentTime < org.StartWorkTime ||
                    request.AppointmentTime.AddMinutes(service.TimeDuration) > org.EndWorkTime)
                    throw new InvalidOperationException("زمان انتخاب شده خارج از محدوده کاری سازمان است.");

                // 5. بررسی زمان استراحت
                if (org.StartRestTime != TimeOnly.MinValue && org.EndRestTime != TimeOnly.MinValue)
                {
                    if (request.AppointmentTime >= org.StartRestTime &&
                        request.AppointmentTime.AddMinutes(service.TimeDuration) <= org.EndRestTime)
                        throw new InvalidOperationException("زمان انتخاب شده در محدوده استراحت سازمان است.");
                }

                // 6. ایجاد نوبت جدید
                var appointment = new Appointment
                {
                    OrgId = orgId,
                    AppointmentDate = request.AppointmentDate,
                    AppointmentTime = request.AppointmentTime,
                    Price = request.Price,
                    OrgserviceId = request.OrgserviceId,
                    BookingUserId = request.BookingUserId,
                    BookingConfirmCode = GenerateTrackingCode(),
                    IsReserved = true,
                    AppointmentStatusId = 1 // فرض می‌کنیم 1 = Reserved
                };

                // 7. ذخیره در دیتابیس
                var createdAppointment = await _appointmentRepository.AddAsync(appointment);

                // 8. افزایش تعداد نوبت‌های موفق سازمان
                org.SuccessAppointmentCount += 1;

                org.ModifiedBy = modifiedBy;
                await _orgRepository.UpdateAsync(org);

                // 9. برگرداندن نتیجه
                return MapToDto(createdAppointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment for org {OrgId}", orgId);
                throw;
            }
        }

        // ============================================================
        //  متد کمکی برای تولید کد رهگیری
        // ============================================================

        private string GenerateTrackingCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var code = new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            return $"RZ-{code[..4]}-{code[4..]}";
        }


        // ============================================================
        // متدهای کمکی
        // ============================================================

        private AppointmentDto MapToDto(Appointment appointment)
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
                BookingUserFullName = appointment.BookingUser != null
                    ? $"{appointment.BookingUser.FirstName} {appointment.BookingUser.LastName}"
                    : null,
                BookingConfirmCode = appointment.BookingConfirmCode,
                IsReserved = appointment.IsReserved,
                AppointmentStatusId = appointment.AppointmentStatusId,
                AppointmentStatus = appointment.AppointmentStatus?.Status
            };
        }
    }
}