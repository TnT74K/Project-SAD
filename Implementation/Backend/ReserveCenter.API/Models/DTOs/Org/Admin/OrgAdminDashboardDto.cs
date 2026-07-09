namespace ReserveCenter.API.Models.DTOs.Org.Admin
{
    public class OrgAdminDashboardDto
    {
        // آمار کلی سازمان
        public int TotalAppointments { get; set; }          // کل نوبت‌ها
        public int TodayAppointments { get; set; }          // نوبت‌های امروز
        public int PendingAppointments { get; set; }        // نوبت‌های در انتظار
        public int CompletedAppointments { get; set; }      // نوبت‌های انجام شده
        public int CancelledAppointments { get; set; }      // نوبت‌های لغو شده
        public int TotalStaff { get; set; }                 // تعداد کارکنان
        public int TotalServices { get; set; }              // تعداد سرویس‌ها
        public decimal AverageStar { get; set; }            // میانگین امتیاز
        public int SuccessAppointmentCount { get; set; }    // نوبت‌های موفق

        // نمودارها (دیتا برای چارت)
        public List<ChartDataDto> WeeklyAppointments { get; set; }    // نوبت‌های هفتگی
        public List<ChartDataDto> MonthlyAppointments { get; set; }   // نوبت‌های ماهانه
        public List<ChartDataDto> ServiceStats { get; set; }          // آمار سرویس‌ها
        public List<ChartDataDto> StaffStats { get; set; }            // آمار کارکنان
    }

    public class ChartDataDto
    {
        public string Label { get; set; }      // برچسب (مثلاً روز هفته یا اسم سرویس)
        public int Value { get; set; }         // مقدار
        public string Color { get; set; }      // رنگ (اختیاری)
    }
}