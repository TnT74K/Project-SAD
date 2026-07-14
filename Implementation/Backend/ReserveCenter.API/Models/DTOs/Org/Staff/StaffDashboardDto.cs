using ReserveCenter.API.Models.DTOs.Org.Appointment;

namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffDashboardDto
    {
        // آمار کارمند
        public int TodayAppointments { get; set; }          // نوبت‌های امروز
        public int TotalAppointments { get; set; }          // کل نوبت‌ها
        public int CompletedAppointments { get; set; }      // نوبت‌های انجام شده
        public int PendingAppointments { get; set; }        // نوبت‌های در انتظار
        public int CancelledAppointments { get; set; }      // نوبت‌های لغو شده

        // لیست نوبت‌های امروز
        public List<AppointmentDto> TodayAppointmentList { get; set; }
    }
}