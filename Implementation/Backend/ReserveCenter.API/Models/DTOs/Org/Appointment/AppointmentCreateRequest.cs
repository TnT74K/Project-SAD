using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Appointment
{
    public class AppointmentCreateRequest
    {
        [Required(ErrorMessage = "شناسه سازمان الزامی است")]
        public int OrgId { get; set; }

        [Required(ErrorMessage = "تاریخ نوبت الزامی است")]
        public DateOnly AppointmentDate { get; set; }

        [Required(ErrorMessage = "ساعت نوبت الزامی است")]
        public TimeOnly AppointmentTime { get; set; }

        [Required(ErrorMessage = "قیمت الزامی است")]
        [Range(0, int.MaxValue, ErrorMessage = "قیمت باید عددی مثبت باشد")]
        public int Price { get; set; }

        [Required(ErrorMessage = "شناسه سرویس الزامی است")]
        public int OrgserviceId { get; set; }

        public int? BookingUserId { get; set; }         // اگر کاربر ثبت‌نام کرده باشد

        [StringLength(256, ErrorMessage = "کد تأیید نمی‌تواند بیشتر از 256 کاراکتر باشد")]
        public string BookingConfirmCode { get; set; }

        public bool IsReserved { get; set; } = true;    // پیش‌فرض رزرو شده

        public int? AppointmentStatusId { get; set; }   // وضعیت اولیه (اختیاری)
    }
}