using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org
{
    public class OrgRegisterRequest
    {
        [Required(ErrorMessage = "نام کسب‌وکار الزامی است")]
        [StringLength(256, ErrorMessage = "نام کسب‌وکار نمی‌تواند بیشتر از 256 کاراکتر باشد")]
        public string Name { get; set; }

        public string Image { get; set; }  // آدرس تصویر (اختیاری)

        [Required(ErrorMessage = "توضیحات الزامی است")]
        [StringLength(500, ErrorMessage = "توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد")]
        public string Description { get; set; }

        [Required(ErrorMessage = "تاریخ تأسیس الزامی است")]
        public DateOnly EstablishmentDate { get; set; }

        [Required(ErrorMessage = "نوع کسب‌وکار الزامی است")]
        public int OrgtypeId { get; set; }

        [Required(ErrorMessage = "روزهای کاری الزامی است")]
        public string ActiveDaysPerWeek { get; set; }  // مثل "شنبه,یکشنبه,دوشنبه"

        [Required(ErrorMessage = "ساعت شروع کار الزامی است")]
        public TimeOnly StartWorkTime { get; set; }

        [Required(ErrorMessage = "ساعت پایان کار الزامی است")]
        public TimeOnly EndWorkTime { get; set; }

        public TimeOnly? StartRestTime { get; set; }  // اختیاری
        public TimeOnly? EndRestTime { get; set; }    // اختیاری

        [Required(ErrorMessage = "شهر الزامی است")]
        public int CityId { get; set; }

        [Required(ErrorMessage = "آدرس الزامی است")]
        [StringLength(256, ErrorMessage = "آدرس نمی‌تواند بیشتر از 256 کاراکتر باشد")]
        public string Address { get; set; }
    }
}