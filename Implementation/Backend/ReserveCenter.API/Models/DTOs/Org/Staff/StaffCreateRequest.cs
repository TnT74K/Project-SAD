using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffCreateRequest
    {
        [Required(ErrorMessage = "شناسه کاربر الزامی است")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "شناسه نقش الزامی است")]
        public int RoleId { get; set; }

        [Required(ErrorMessage = "شناسه سازمان الزامی است")]
        public int OrgId { get; set; }

        public bool IsActive { get; set; } = true;      // پیش‌فرض فعال
    }
}