using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffUpdateRequest
    {
        [Required(ErrorMessage = "شناسه کارمند الزامی است")]
        public int StaffId { get; set; }

        [Required(ErrorMessage = "شناسه نقش الزامی است")]
        public int RoleId { get; set; }

        public bool IsActive { get; set; }
    }
}