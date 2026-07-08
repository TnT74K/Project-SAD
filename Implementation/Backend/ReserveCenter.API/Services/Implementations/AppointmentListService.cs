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
        private readonly ReserveCenterDBContext _dbContext;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AppointmentListService> _logger;

        public AppointmentListService(
            ReserveCenterDBContext dbContext,
            IAppointmentRepository appointmentRepository,
            IOrgRepository orgRepository,
            IUserRepository userRepository,
            ILogger<AppointmentListService> logger)
        {
            _dbContext = dbContext;
            _appointmentRepository = appointmentRepository;
            _orgRepository = orgRepository;
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

                var appointments = await _dbContext.Appointments
                    .AsNoTracking()
                    .Include(a => a.AppointmentStatus)
                    .Include(a => a.BookingUser)
                    .Include(a => a.Org)
                    .Include(a => a.Orgservice)
                    .Where(a => a.OrgId == orgId && a.AppointmentDate == date)
                    .OrderBy(a => a.AppointmentTime)
                    .ToListAsync();

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

                var appointments = await _dbContext.Appointments
                    .AsNoTracking()
                    .Include(a => a.AppointmentStatus)
                    .Include(a => a.BookingUser)
                    .Include(a => a.Org)
                    .Include(a => a.Orgservice)
                    .Where(a => a.OrgId == orgId && 
                                a.AppointmentDate >= startDate && 
                                a.AppointmentDate <= endDate)
                    .OrderBy(a => a.AppointmentDate)
                    .ThenBy(a => a.AppointmentTime)
                    .ToListAsync();

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

                var status = await _dbContext.AppointmentStatuses
                    .FirstOrDefaultAsync(s => s.Id == request.AppointmentStatusId);
                if (status == null)
                    return false;

                // ✅ فقط فیلدهای موجود در مدل را به‌روزرسانی می‌کنیم
                appointment.AppointmentStatusId = request.AppointmentStatusId;
                // ❌ ModifiedBy و ModifiedDate رو حذف می‌کنیم چون در مدل وجود ندارند

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