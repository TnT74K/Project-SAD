namespace ReserveCenter.API.Models.DTOs.Org.Appointment
{
    public class AppointmentDto
    {
        public int Id { get; set; }                     // شناسه نوبت
        public int OrgId { get; set; }                  // شناسه سازمان
        public string OrgName { get; set; }             // نام سازمان (برای نمایش)
        public DateOnly AppointmentDate { get; set; }   // تاریخ نوبت
        public TimeOnly AppointmentTime { get; set; }   // ساعت نوبت
        public int Price { get; set; }                  // قیمت
        public int OrgserviceId { get; set; }           // شناسه سرویس
        public string ServiceName { get; set; }         // نام سرویس (برای نمایش)
        public int? BookingUserId { get; set; }         // شناسه کاربر رزروکننده
        public string BookingUserFullName { get; set; } // نام و نام خانوادگی کاربر (برای نمایش)
        public string BookingConfirmCode { get; set; }  // کد تأیید
        public bool IsReserved { get; set; }            // وضعیت رزرو
        public int? AppointmentStatusId { get; set; }   // شناسه وضعیت
        public string AppointmentStatus { get; set; }   // نام وضعیت (برای نمایش)
    }
}