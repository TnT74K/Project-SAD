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
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),         // used in Controllers to identify user
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


    public async Task<TokenResponse> RegisterAsync(SignUpRequest request)
    {
        // Check phone number existance
        if (await _context.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber))
        {
            throw new InvalidOperationException("شماره تلفن قبلاً ثبت شده است.");
        }
        // Create user object
        var user = new User
        {
            FirstName = "",
            LastName = "",
            PhoneNumber = request.PhoneNumber,
            Password = request.Password,
            IsBlocked = false,
            IsDeleted = false,
            WrongPasswordCount = 0
        };

        // Save the object to database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new TokenResponse
        {
            IsSuccess = true,
            Message = "ثبت‌نام با موفقیت انجام شد."
        };
    }

    #region Login
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
            UserId = user.Id,
            Roles = roles
        };
    }
    #endregion
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
                Role = roleId,
                IsBlocked = user.IsBlocked,
                IsDeleted = user.IsDeleted
            }
        };
    }

    public async Task<bool> ForgotPasswordAsync(string phoneNumber)
    {
        // For the university project, OTP is fixed to 54321 and not generated or stored.
        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        if (user == null || user.IsBlocked || user.IsDeleted)
        {
            return false;
        }
        return true;
    }

    public async Task<string> VerifyOtpAsync(string phoneNumber, string otpCode)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        if (user == null || user.IsBlocked || user.IsDeleted)
        {
            throw new UnauthorizedAccessException("کاربر یافت نشد یا حساب کاربری غیرفعال است.");
        }
        if (otpCode != "54321")
        {
            throw new UnauthorizedAccessException("کد تایید نامعتبر است.");
        }
        return "RESET_TOKEN";
    }

    public async Task<bool> ResetPasswordAsync(string phoneNumber, string token, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        if (user == null || user.IsBlocked || user.IsDeleted)
        {
            throw new UnauthorizedAccessException();
        }
        if (token != "RESET_TOKEN")
        {
            throw new UnauthorizedAccessException("توکن بازیابی نامعتبر است.");
        }
        user.LastPassword = user.Password;
        user.Password = newPassword;
        user.ChangePasswordDateTime = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    //Because our JWTs are stateless and we don’t store refresh tokens, logout is very simple:
    public async Task<bool> LogoutAsync(int userId)
    {
        return await ValidateUserAsync(userId);
    }

    public Task<TokenResponse> RefreshTokenAsync(string refreshToken)
    {
        throw new NotSupportedException("Refresh tokens are not implemented in this university project.");
    }

    public async Task<bool> ValidateUserAsync(int userId, string? role = null)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null || user.IsBlocked || user.IsDeleted)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(role))
        {
            return true;
        }

        if (role == Roles.Customer)
        {
            return true;
        }

        var roleEntry = Roles.RoleNames.FirstOrDefault(r => r.Value == role);

        if (roleEntry.Equals(default(KeyValuePair<int, string>)))
        {
            return false;
        }

        return await _context.StaffLists.AnyAsync(s =>
            s.UserId == userId &&
            s.RoleId == roleEntry.Key &&
            s.IsActive);
    }

    // Also validate the org with the role. (not yet to be implemented)
    public Task<bool> ValidateUserAsync(int userId, string role, int? orgId)
    {
        throw new NotImplementedException();
    }

    public async Task<UserInfoDto> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            throw new KeyNotFoundException("کاربر یافت نشد.");
        }

        return new UserInfoDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            IsBlocked = user.IsBlocked,
            IsDeleted = user.IsDeleted
        };
    }
}
