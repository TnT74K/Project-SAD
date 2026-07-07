namespace ReserveCenter.API.Models.DTOs.Org
{
    public class OrgRegisterResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int? UnregisteredOrgId { get; set; }
        public string Status { get; set; } // "Pending", "Approved", "Rejected"
        public DateTime CreatedDate { get; set; }
    }
}