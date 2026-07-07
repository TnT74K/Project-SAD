namespace ReserveCenter.API.Models.DTOs.Auth;

public class RoleSelectionDto
{
    public string RoleName { get; set; } = "";

    public int? OrgId { get; set; }

    public string? OrganizationName { get; set; }
}