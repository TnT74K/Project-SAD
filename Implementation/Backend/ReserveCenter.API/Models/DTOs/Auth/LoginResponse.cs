namespace ReserveCenter.API.Models.DTOs.Auth;

public class LoginResponse
{
    public List<RoleSelectionDto> Roles { get; set; } = [];
}