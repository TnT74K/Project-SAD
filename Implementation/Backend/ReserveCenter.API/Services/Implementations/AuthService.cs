using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ReserveCenter.API.DatabaseModels;
using Microsoft.Extensions.Options;
using ReserveCenter.API.Models.Settings;
using ReserveCenter.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.Models.DTOs.Auth;
using ReserveCenter.API.Constants;

namespace ReserveCenter.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ReserveCenterDBContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        ReserveCenterDBContext context,
        IOptions<JwtSettings> jwtOptions)
    {
        _context = context;
        _jwtSettings = jwtOptions.Value;
    }

    public string GenerateJwtToken(User user, string role, int? orgId = null) // if the user has a role other than customer, we'll include it too
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.PhoneNumber),
            new(ClaimTypes.Role, role)
        };

        if (orgId.HasValue)
        {
            claims.Add(new("OrgId", orgId.Value.ToString()));
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public Task<TokenResponse> RegisterAsync(SignUpRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);

        if (user is null)
        {
            throw new UnauthorizedAccessException("شماره موبایل یا رمز عبور معتبر نیست.");
        }

        if (user.Password != request.Password)
        {
            throw new UnauthorizedAccessException("شماره موبایل یا رمز عبور معتبر نیست.");
        }

        //find all roles for this user.
        var roles = new List<RoleSelectionDto>();

        roles.Add(new RoleSelectionDto
        {
            RoleName = Roles.Customer,
            OrgId = null,
            OrganizationName = null
        });

        var staffRoles = await _context.StaffLists
            .Include(s => s.Org)
            .Where(s => s.UserId == user.Id && s.IsActive)
            .ToListAsync();

        foreach (var staffRole in staffRoles)
        {
            roles.Add(new RoleSelectionDto
            {
                RoleName = Roles.RoleNames[staffRole.RoleId],
                OrgId = staffRole.OrgId,
                OrganizationName = staffRole.Org.Name
            });
        }
        return new LoginResponse
        {
            Roles = roles
        };
    }

    public Task<TokenResponse> SelectRoleAsync(int userId, string roleName, int? orgId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ForgotPasswordAsync(string phoneNumber)
    {
        throw new NotImplementedException();
    }

    public Task<string> VerifyOtpAsync(string phoneNumber, string otpCode)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ResetPasswordAsync(string phoneNumber, string token, string newPassword)
    {
        throw new NotImplementedException();
    }

    public Task<bool> LogoutAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<TokenResponse> RefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ValidateUserAsync(int userId, string role = null)
    {
        throw new NotImplementedException();
    }

    public Task<UserInfoDto> GetUserByIdAsync(int userId)
    {
        throw new NotImplementedException();
    }
}
