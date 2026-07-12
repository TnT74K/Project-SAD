namespace ReserveCenter.API.Models.Settings;

// This lets ASP.NET automatically bind Jwt to a C# object.
public class JwtSettings
{
    public string SecretKey { get; set; } = "";
    public string Issuer { get; set; } = "";
    public string Audience { get; set; } = "";
    public int ExpiryMinutes { get; set; }
    public int RefreshTokenExpiryDays { get; set; }
}