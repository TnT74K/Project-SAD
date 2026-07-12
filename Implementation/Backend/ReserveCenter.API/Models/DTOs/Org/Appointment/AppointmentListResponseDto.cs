namespace ReserveCenter.API.Models.DTOs.Org.Appointment
{
    public class AppointmentListResponse
    {
        public int TotalCount { get; set; }                        // تعداد کل نوبت‌ها
        public List<AppointmentDto> Appointments { get; set; }     // لیست نوبت‌ها
    }
}