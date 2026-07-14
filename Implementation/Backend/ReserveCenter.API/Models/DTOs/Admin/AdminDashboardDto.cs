namespace ReserveCenter.API.Models.DTOs.Admin
{
    public class AdminDashboardDto
    {
        // تاریخ‌ها
        public DateOnly TodayDate { get; set; }
        public DateOnly YesterdayDate { get; set; }

        // آمار کاربران
        public int TotalUsers { get; set; }                 // کل کاربران
        public int BlockedUsers { get; set; }               // کاربران مسدود شده

        // آمار سازمان‌ها
        public int TotalOrgs { get; set; }                  // کل سازمان‌ها
        public int PendingOrgs { get; set; }                // سازمان‌های در انتظار تأیید
        public int DeletedOrgs { get; set; }                // سازمان‌های حذف شده

        // آمار نوبت‌ها (کل سیستم)
        public int TotalAppointments { get; set; }          // کل نوبت‌ها
        public int TodayReserved { get; set; }              // رزروهای امروز
        public int TodayPresenced { get; set; }             // حضور یافته
        public int TodayCanceled { get; set; }              // لغو شده
        public int TodayAbsented { get; set; }              // عدم حضور
        public int TodayTotal { get; set; }                 // جمع کل امروز

        // درصدها (نسبت به دیروز)
        public double TodayReservedPercent { get; set; }
        public double TodayPresencedPercent { get; set; }
        public double TodayCanceledPercent { get; set; }
        public double TodayAbsentedPercent { get; set; }
    }
}