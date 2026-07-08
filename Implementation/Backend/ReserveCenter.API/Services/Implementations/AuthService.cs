using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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
        // check for pre-existing phone number
        if (await _context.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber))
        {
            throw new InvalidOperationException("این شماره‌تلفن قبلاً ثبت شده است.");
        }

        // create uer object
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Password = request.Password,
            CityId = request.CityId,
            IsBlocked = false,
            IsDeleted = false
        };
    }
    #region Login and Role Selection
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

        var staffAssignments = await _context.StaffLists
            .Include(s => s.Org)
            .Where(s => s.UserId == user.Id && s.IsActive)
            .ToListAsync();

        foreach (var staffAssignment in staffAssignments)
        {
            roles.Add(new RoleSelectionDto
            {
                RoleName = Roles.RoleNames[staffAssignment.RoleId],
                OrgId = staffAssignment.OrgId,
                OrganizationName = staffAssignment.Org.Name
            });
        }
        return new LoginResponse
        {
            Roles = roles
        };
    }

    public async Task<TokenResponse> SelectRoleAsync(int userId, string roleName, int? orgId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new UnauthorizedAccessException("کاربر یافت نشد.");

        if (user.IsBlocked || user.IsDeleted)
            throw new UnauthorizedAccessException("حساب کاربر مسدود یا حذف شده‌است");

        if (!Roles.IsValidRole(roleName))
            throw new UnauthorizedAccessException("نقش نامعتبر");

        var roleEntry = Roles.RoleNames.FirstOrDefault(r => r.Value == roleName);
        if (roleEntry.Equals(default(KeyValuePair<int, string>)))
            throw new UnauthorizedAccessException("معادل نقش یافت نشد");

        var roleId = roleEntry.Key;

        if (roleName != Roles.Customer)
        {
            if (!orgId.HasValue)
                throw new UnauthorizedAccessException("شناسه(آی‌دی) کسب‌وکار برای این نقش لازم است.");

            var staffAssignment = await _context.StaffLists
                .FirstOrDefaultAsync(s =>
                    s.UserId == userId &&
                    s.OrgId == orgId &&
                    s.RoleId == roleId &&
                    s.IsActive);

            if (staffAssignment is null)
                throw new UnauthorizedAccessException(
                    "کاربر، نقش انتخاب‌شده را در این کسب‌وکار ندارد.");
        }

        var token = GenerateJwtToken(user, roleName, orgId);
        var refreshToken = Guid.NewGuid().ToString();

        return new TokenResponse
        {
            IsSuccess = true,
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            User = new UserInfoDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Role = roleName,
                IsBlocked = user.IsBlocked,
                IsDeleted = user.IsDeleted
            }
        };
    }


    #endregion
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
