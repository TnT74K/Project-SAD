using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffUpdateRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "شناسه نقش الزامی است")]
        public int RoleId { get; set; }

        public int ModifiedBy { get; set; }
    }
}