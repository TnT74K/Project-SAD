using ReserveCenter.API.Models.DTOs.Org.Admin;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;
        private readonly IOrgRepository _orgRepository;

        public DashboardService(
            IDashboardRepository dashboardRepository,
            IOrgRepository orgRepository)
        {
            _dashboardRepository = dashboardRepository;
            _orgRepository = orgRepository;
        }

        public async Task<OrgAdminDashboardDto> GetOrgDashboardAsync(int orgId)
        {
            // 1. دریافت اطلاعات سازمان
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            // 2. دریافت آمار امروز
            var todayReserved = await _dashboardRepository.CountTodayReservedAppointmentByOrgIdAsync(orgId);
            var todayPresenced = await _dashboardRepository.CountTodayPresencedAppointmentByOrgIdAsync(orgId);
            var todayCanceled = await _dashboardRepository.CountTodayCanceledAppointmentByOrgIdAsync(orgId);
            var todayAbsented = await _dashboardRepository.CountTodayAbsentedAppointmentByOrgIdAsync(orgId);
            var todayTotal = todayReserved + todayPresenced + todayCanceled + todayAbsented;

            // 3. دریافت آمار دیروز (برای محاسبه درصد)
            var yesterdayReserved = await _dashboardRepository.CountYesterdayReservedAppointmentByOrgIdAsync(orgId);
            var yesterdayPresenced = await _dashboardRepository.CountYesterdayPresencedAppointmentByOrgIdAsync(orgId);
            var yesterdayCanceled = await _dashboardRepository.CountYesterdayCanceledAppointmentByOrgIdAsync(orgId);
            var yesterdayAbsented = await _dashboardRepository.CountYesterdayAbsentedAppointmentByOrgIdAsync(orgId);
            var yesterdayTotal = yesterdayReserved + yesterdayPresenced + yesterdayCanceled + yesterdayAbsented;

            // 4. محاسبه درصدها (نسبت به دیروز)
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

            // 5. دریافت آمار کلی
            var totalAppointments = await _dashboardRepository.CountAllAppointmentByOrgIdAsync(orgId);
            var starCount = await _dashboardRepository.GetOrgStarByOrgIdAsync(orgId);
            var voterCount = await _dashboardRepository.GetVoterCountByOrgIdAsync(orgId);

            // 6. دریافت تاریخ امروز و دیروز برای ارسال به فرانت
            var today = DateOnly.FromDateTime(DateTime.Today);
            var yesterday = today.AddDays(-1);

            // 7. ساخت DTO خروجی
            return new OrgAdminDashboardDto
            {
                // اطلاعات سازمان
                OrgId = org.Id,
                OrgName = org.Name,

                // تاریخ‌ها
                TodayDate = today,
                YesterdayDate = yesterday,

                // آمار امروز
                TodayReserved = todayReserved,
                TodayPresenced = todayPresenced,
                TodayCanceled = todayCanceled,
                TodayAbsented = todayAbsented,
                TodayTotal = todayTotal,

                // درصدها (نسبت به دیروز)
                TodayReservedPercent = todayReservedPercent,
                TodayPresencedPercent = todayPresencedPercent,
                TodayCanceledPercent = todayCanceledPercent,
                TodayAbsentedPercent = todayAbsentedPercent,

                // آمار کلی
                TotalAppointments = totalAppointments,
                StarCount = starCount,
                VoterCount = voterCount
            };
        }
    }
}