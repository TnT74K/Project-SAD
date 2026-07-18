namespace ReserveCenter.API.Models.DTOs.Auth;
// Sent from the backend to the frontend after login (the available roles).

public class RoleSelectionDto
{
    // Null represents the customer selection.
    public string? RoleName { get; set; }

    public int? OrgId { get; set; }

    public string? OrganizationName { get; set; }
}
