namespace ReserveCenter.API.Models.DTOs.Auth;

// This shows all the roles a user has, after they pass authentication in login page.
public class LoginResponse
{
    public int UserId { get; set; }
    public List<RoleSelectionDto> Roles { get; set; } = [];

    // True only when the user signed in with the previous password during the
    // short grace period after a password reset/change.
    public bool RequiresPasswordChange { get; set; }
    public string? Message { get; set; }
}
