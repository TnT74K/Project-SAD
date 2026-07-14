using ReserveCenter.API.Models.DTOs.Admin;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly ISuperAdminDashboardRepository _superAdminDashboardRepository;
        private readonly IUserRepository _userRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IUnregisteredOrgRepository _unregisteredOrgRepository;

        public AdminDashboardService(
            ISuperAdminDashboardRepository superAdminDashboardRepository,
            IUserRepository userRepository,
            IOrgRepository orgRepository,
            IUnregisteredOrgRepository unregisteredOrgRepository)
        {
            _superAdminDashboardRepository = superAdminDashboardRepository;
            _userRepository = userRepository;
            _orgRepository = orgRepository;
            _unregisteredOrgRepository = unregisteredOrgRepository;
        }

        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
        {
            // 1. دریافت آمار کاربران
            var allUsers = await _userRepository.AllUserAsync();
            var totalUsers = allUsers?.Count ?? 0;
            var blockedUsers = allUsers?.Count(u => u.IsBlocked) ?? 0;

            // 2. دریافت آمار سازمان‌ها
            var allOrgs = await _orgRepository.GetAllOrgWithDetailAsync();
            var totalOrgs = allOrgs?.Count ?? 0;
            var deletedOrgs = allOrgs?.Count(o => o.IsDeleted) ?? 0;

            // 3. دریافت سازمان‌های در انتظار تایید
            var pendingOrgs = await _unregisteredOrgRepository.GetAllAsync();
            var pendingOrgsCount = pendingOrgs?.Count ?? 0;

            // 4. دریافت آمار نوبت‌ها از SuperAdminDashboardRepository
            var totalAppointments = await _superAdminDashboardRepository.CountAllAppointmentAsync();
            var todayReserved = await _superAdminDashboardRepository.CountTodayReservedAppointmentAsync();
            var yesterdayReserved = await _superAdminDashboardRepository.CountYesterdayReservedAppointmentAsync();
            var todayPresenced = await _superAdminDashboardRepository.CountTodayPresencedAppointmentAsync();
            var yesterdayPresenced = await _superAdminDashboardRepository.CountYesterdayPresencedAppointmentAsync();
            var todayCanceled = await _superAdminDashboardRepository.CountTodayCanceledAppointmentAsync();
            var yesterdayCanceled = await _superAdminDashboardRepository.CountYesterdayCanceledAppointmentAsync();
            var todayAbsented = await _superAdminDashboardRepository.CountTodayAbsentedAppointmentAsync();
            var yesterdayAbsented = await _superAdminDashboardRepository.CountYesterdayAbsentedAppointmentAsync();

            // 5. محاسبه درصدها (نسبت به دیروز)
            var yesterdayTotal = yesterdayReserved + yesterdayPresenced + yesterdayCanceled + yesterdayAbsented;
            double todayReservedPercent = 0;
            double todayPresencedPercent = 0;
            double todayCanceledPercent = 0;
            double todayAbsentedPercent = 0;

            if (yesterdayTotal > 0)
            {
                todayReservedPercent = Math.Round((double)todayReserved / yesterdayTotal * 100, 1);
                todayPresencedPercent = Math.Round((double)todayPresenced / yesterdayTotal * 100, 1);
                todayCanceledPercent = Math.Round((double)todayCanceled / yesterdayTotal * 100, 1);
                todayAbsentedPercent = Math.Round((double)todayAbsented / yesterdayTotal * 100, 1);
            }

            // 6. دریافت تاریخ امروز و دیروز
            var today = DateOnly.FromDateTime(DateTime.Today);
            var yesterday = today.AddDays(-1);

            // 7. ساخت DTO خروجی
            return new AdminDashboardDto
            {
                // تاریخ‌ها
                TodayDate = today,
                YesterdayDate = yesterday,

                // آمار کاربران
                TotalUsers = totalUsers,
                BlockedUsers = blockedUsers,

                // آمار سازمان‌ها
                TotalOrgs = totalOrgs,
                PendingOrgs = pendingOrgsCount,
                DeletedOrgs = deletedOrgs,

                // آمار نوبت‌ها
                TotalAppointments = totalAppointments,
                TodayReserved = todayReserved,
                TodayPresenced = todayPresenced,
                TodayCanceled = todayCanceled,
                TodayAbsented = todayAbsented,
                TodayTotal = todayReserved + todayPresenced + todayCanceled + todayAbsented,

                // درصدها
                TodayReservedPercent = todayReservedPercent,
                TodayPresencedPercent = todayPresencedPercent,
                TodayCanceledPercent = todayCanceledPercent,
                TodayAbsentedPercent = todayAbsentedPercent
            };
        }
    }
}