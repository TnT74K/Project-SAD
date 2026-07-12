using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Service
{
    public class ServiceCreateRequest
    {
        [Required(ErrorMessage = "نام سرویس الزامی است")]
        [StringLength(256, ErrorMessage = "نام سرویس نمی‌تواند بیشتر از 256 کاراکتر باشد")]
        public string Name { get; set; }

        [Required(ErrorMessage = "مدت زمان سرویس الزامی است")]
        [Range(1, 1440, ErrorMessage = "مدت زمان باید بین 1 تا 1440 دقیقه باشد")]
        public int TimeDuration { get; set; }  // به دقیقه

        [Required(ErrorMessage = "شناسه سازمان الزامی است")]
        public int Orgid { get; set; }
    }
}