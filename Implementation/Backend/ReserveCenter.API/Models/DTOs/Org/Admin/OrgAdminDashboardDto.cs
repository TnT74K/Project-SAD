namespace ReserveCenter.API.Models.DTOs.Org.Admin
{
    public class OrgAdminDashboardDto
    {
        // آمار کلی سازمان
                // اطلاعات سازمان
        public int OrgId { get; set; }
        public string OrgName { get; set; }
              // تاریخ‌ها
        public DateOnly TodayDate { get; set; }
        public DateOnly YesterdayDate { get; set; }

        public int TotalAppointments { get; set; }          // کل نوبت‌ها
       public int TodayReserved { get; set; }      // کل رزروهای امروز
        public int PendingAppointments { get; set; }        // نوبت‌های در انتظار
        public int TodayPresenced { get; set; }     // حضور یافته
        public int TodayCanceled { get; set; }      // لغو شده
        public int TodayAbsented { get; set; }      // عدم حضور
        public int TodayTotal { get; set; }         // جمع کل امروز
                // درصدها (نسبت به دیروز)
        public double TodayReservedPercent { get; set; }
        public double TodayPresencedPercent { get; set; }
        public double TodayCanceledPercent { get; set; }
        public double TodayAbsentedPercent { get; set; }
                // آمار کلی
        public decimal StarCount { get; set; }      // امتیاز
        public int VoterCount { get; set; }         // تعداد امتیازدهندگان
        public int TotalStaff { get; set; }                 // تعداد کارکنان
        public int TotalServices { get; set; }              // تعداد سرویس‌ها
     
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