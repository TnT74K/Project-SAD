using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffCreateRequest
    {
        [Required(ErrorMessage = "شماره موبایل الزامی است")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "شناسه کسب و کار الزامی است")]
        public int OrgId { get; set; }

        [Required(ErrorMessage = "شناسه نقش الزامی است")]
        public int RoleId { get; set; }

        public int CreatedBy { get; set; }
    }
}