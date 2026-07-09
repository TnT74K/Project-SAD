namespace ReserveCenter.API.Models.DTOs.User
{
    public class UserAppointmentStatsDto
    {
        public int ReservedCount { get; set; }   // تعداد نوبت‌های رزرو شده
        public int DoneCount { get; set; }       // تعداد نوبت‌های انجام شده
        public int CancelledCount { get; set; }  // تعداد نوبت‌های لغو شده
        public int TotalCount { get; set; }      // جمع کل
    }
}