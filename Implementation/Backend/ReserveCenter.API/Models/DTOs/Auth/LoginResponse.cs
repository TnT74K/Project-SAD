namespace ReserveCenter.API.Models.DTOs.Auth;

// This shows all the roles a user has, after they pass authentication in login page.
public class LoginResponse
{
    public List<RoleSelectionDto> Roles { get; set; } = [];
}