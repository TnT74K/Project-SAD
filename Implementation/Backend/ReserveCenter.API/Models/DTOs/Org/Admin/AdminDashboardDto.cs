using ReserveCenter.API.Models.DTOs.Org.Admin;

namespace ReserveCenter.API.Models.DTOs.Admin
{
    public class AdminDashboardDto
    {
        // آمار کلی سیستم
        public int TotalUsers { get; set; }                 // کل کاربران
        public int TotalOrgs { get; set; }                  // کل سازمان‌ها
        public int PendingOrgs { get; set; }                // سازمان‌های در انتظار تأیید
        public int TotalAppointments { get; set; }          // کل نوبت‌ها
        public int TodayAppointments { get; set; }          // نوبت‌های امروز
        public int TotalStaff { get; set; }                 // کل کارکنان
        public int BlockedUsers { get; set; }               // کاربران مسدود شده
        public int DeletedOrgs { get; set; }                // سازمان‌های حذف شده

        // نمودارها (دیتا برای چارت)
        public List<ChartDataDto> DailyAppointments { get; set; }    // نوبت‌های روزانه (۷ روز اخیر)
        public List<ChartDataDto> MonthlyAppointments { get; set; }   // نوبت‌های ماهانه
        public List<ChartDataDto> OrgTypesStats { get; set; }         // آمار نوع سازمان‌ها
        public List<ChartDataDto> UsersStats { get; set; }            // آمار کاربران
        public List<ChartDataDto> RevenueStats { get; set; }          // آمار درآمد (اختیاری)
    }
}