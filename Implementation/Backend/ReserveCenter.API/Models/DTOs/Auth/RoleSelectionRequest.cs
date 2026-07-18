namespace ReserveCenter.API.Models.DTOs.Auth
// Sent from the frontend to the backend when the user chooses one of those roles.
{
    public class RoleSelectionRequest
    {
        public int UserId { get; set; }
        // Null represents the customer selection.
        public string? RoleName { get; set; }
        public int? OrgId { get; set; }
    }
}
