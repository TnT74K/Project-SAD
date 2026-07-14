using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Service
{
    public class ServiceUpdateRequest
    {
        [Required(ErrorMessage = "شناسه سرویس الزامی است")]
        public int Id { get; set; }

        [Required(ErrorMessage = "نام سرویس الزامی است")]
        [StringLength(256, ErrorMessage = "نام سرویس نمی‌تواند بیشتر از 256 کاراکتر باشد")]
        public string Name { get; set; }

        [Required(ErrorMessage = "مدت زمان سرویس الزامی است")]
        [Range(1, 1440, ErrorMessage = "مدت زمان باید بین 1 تا 1440 دقیقه باشد")]
        public int TimeDuration { get; set; }
    }
}