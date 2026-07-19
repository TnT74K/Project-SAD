using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using ReserveCenter.API.Models.Settings;
using ReserveCenter.API.Services.Interfaces;
using ReserveCenter.API.Models.DTOs.Auth;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Services.Implementations;

public class AuthService : IAuthService
{
    private const int MaxWrongPasswordAttempts = 5;
    private static readonly TimeSpan LoginLockoutDuration = TimeSpan.FromMinutes(15);
    private static readonly TimeSpan PreviousPasswordGracePeriod = TimeSpan.FromHours(24);

    private readonly IUserRepository _userRepository;
    private readonly IStaffListRepository _staffListRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IUserRepository userRepository,
        IStaffListRepository staffListRepository,
        IOptions<JwtSettings> jwtOptions)

    {
        _userRepository = userRepository;
        _staffListRepository = staffListRepository;
        _jwtSettings = jwtOptions.Value;
    }

    public string GenerateJwtToken(User user, string? role, int? orgId = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),         // used in Controllers to identify user
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.PhoneNumber)
        };

        // A customer has no role; do not add a role claim for that selection.
        if (role is not null)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

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
        if (await _userRepository.PhoneNumberExistsAsync(request.PhoneNumber))
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
        await _userRepository.CreateAsync(user);

        return new TokenResponse
        {
            IsSuccess = true,
            Message = "ثبت‌نام با موفقیت انجام شد."
        };
    }

    #region Login
    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByPhoneNumberAsync(request.PhoneNumber);

        if (user is null)
        {
            throw new UnauthorizedAccessException("شماره موبایل یا رمز عبور معتبر نیست.");
        }

        if (user.IsBlocked || user.IsDeleted)
        {
            throw new UnauthorizedAccessException("حساب کاربر مسدود یا حذف شده‌است.");
        }

        var now = DateTime.UtcNow;

        // Clear an expired cooldown so the user receives a new set of attempts.
        if (user.NextTimeToLogin.HasValue && user.NextTimeToLogin <= now)
        {
            user.NextTimeToLogin = null;
            user.WrongPasswordCount = 0;
            await _userRepository.UpdateAsync(user);
        }

        if (user.NextTimeToLogin.HasValue)
        {
            throw new UnauthorizedAccessException(
                $"به دلیل ورودهای ناموفق متعدد، تا {user.NextTimeToLogin.Value.ToLocalTime():HH:mm} نمی‌توانید وارد شوید.");
        }

        var usedCurrentPassword = user.Password == request.Password;
        var usedPreviousPassword =
            !usedCurrentPassword &&
            !string.IsNullOrEmpty(user.LastPassword) &&
            user.ChangePasswordDateTime.HasValue &&
            now - user.ChangePasswordDateTime.Value <= PreviousPasswordGracePeriod &&
            user.LastPassword == request.Password;

        // User entered wrong password
        if (!usedCurrentPassword && !usedPreviousPassword)
        {
            user.WrongPasswordCount++;

            if (user.WrongPasswordCount >= MaxWrongPasswordAttempts)
            {
                user.NextTimeToLogin = now.Add(LoginLockoutDuration);
            }

            // This must be saved before throwing; otherwise EF never persists the failed attempt.
            await _userRepository.UpdateAsync(user);

            if (user.NextTimeToLogin.HasValue)
            {
                throw new UnauthorizedAccessException(
                    $"تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً {LoginLockoutDuration.TotalMinutes:0} دقیقه دیگر تلاش کنید.");
            }

            var remainingAttempts = MaxWrongPasswordAttempts - user.WrongPasswordCount;
            throw new UnauthorizedAccessException(
                $"شماره موبایل یا رمز عبور معتبر نیست. {remainingAttempts} تلاش دیگر باقی مانده است.");
        }

        // Both the current password and a valid previous-password grace login are successful.
        user.WrongPasswordCount = 0;
        user.NextTimeToLogin = null;
        await _userRepository.UpdateAsync(user);

        //find all roles for this user.
        var roles = new List<RoleSelectionDto>();

        roles.Add(new RoleSelectionDto
        {
            RoleName = null,
            OrgId = null,
            OrganizationName = null
        });

        // Assignment = Role
        var staffAssignments = await _staffListRepository.GetActiveAssignmentsByUserIdAsync(user.Id);

        foreach (var staffAssignment in staffAssignments)
        {
            roles.Add(new RoleSelectionDto
            {
                RoleName = ((RoleEnum)staffAssignment.RoleId).ToString(), // Implicit convertion
                OrgId = staffAssignment.OrgId,
                OrganizationName = staffAssignment.Org.Name
            });
        }
        return new LoginResponse
        {
            UserId = user.Id,
            Roles = roles,
            RequiresPasswordChange = usedPreviousPassword,
            Message = usedPreviousPassword
                ? "با رمز عبور قبلی وارد شدید. لطفاً رمز عبور خود را تغییر دهید."
                : null
        };
    }
    #endregion
    public async Task<TokenResponse> SelectRoleAsync(int userId, string? roleName, int? orgId)
    {
        var user = await _userRepository.GetByIdForAuthenticationAsync(userId);

        if (user is null)
            throw new UnauthorizedAccessException("کاربر یافت نشد.");

        if (user.IsBlocked || user.IsDeleted)
            throw new UnauthorizedAccessException("حساب کاربر مسدود یا حذف شده‌است");

        RoleEnum? selectedRole = null;

        if (roleName is not null && roleName != "Customer" && roleName != "null")
        {
            if (!TryParseStaffRole(roleName, out var staffRole))
                throw new UnauthorizedAccessException("نقش نامعتبر");

            if (!orgId.HasValue)
                throw new UnauthorizedAccessException("شناسه(آی‌دی) کسب‌وکار برای این نقش لازم است.");

            var hasStaffAssignment = await _staffListRepository.HasActiveAssignmentAsync(
                userId, (int)staffRole, orgId);

            if (!hasStaffAssignment)
                throw new UnauthorizedAccessException(
                    "کاربر، نقش انتخاب‌شده را در این کسب‌وکار ندارد.");

            selectedRole = staffRole;
        }
        else if (orgId.HasValue)
        {
            throw new UnauthorizedAccessException("نقش مشتری نباید شناسه کسب‌وکار داشته باشد.");
        }

        var token = GenerateJwtToken(user, selectedRole?.ToString(), orgId);
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
                Role = (int?)selectedRole, // Implicit enum conversion
                IsBlocked = user.IsBlocked,
                IsDeleted = user.IsDeleted
            }
        };
    }

    public async Task<bool> ForgotPasswordAsync(string phoneNumber)
    {
        // For the university project, OTP is fixed to 54321 and not generated or stored.
        var user = await _userRepository.GetByPhoneNumberAsync(phoneNumber);
        if (user == null || user.IsBlocked || user.IsDeleted)
        {
            return false;
        }
        return true;
    }

    public async Task<string> VerifyOtpAsync(string phoneNumber, string otpCode)
    {
        var user = await _userRepository.GetByPhoneNumberAsync(phoneNumber);
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
        var user = await _userRepository.GetByPhoneNumberAsync(phoneNumber);
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
        user.WrongPasswordCount = 0;
        user.NextTimeToLogin = null;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public Task<TokenResponse> RefreshTokenAsync(string refreshToken)
    {
        throw new NotSupportedException("Refresh tokens are not implemented in this university project.");
    }

    public async Task<bool> ValidateUserAsync(int userId, string? role = null)
    {
        var user = await _userRepository.GetByIdForAuthenticationAsync(userId);

        if (user is null || user.IsBlocked || user.IsDeleted)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(role))
        {
            return true;
        }

        if (!TryParseStaffRole(role, out var staffRole))
        {
            return false;
        }

        return await _staffListRepository.HasActiveAssignmentAsync(userId, (int)staffRole);
    }

    // Also validate the org with the role. (not yet to be implemented)
    public Task<bool> ValidateUserAsync(int userId, string role, int? orgId)
    {
        throw new NotImplementedException();
    }

    public async Task<UserInfoDto> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetByIdForAuthenticationAsync(userId);

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

    private static bool TryParseStaffRole(string? roleName, out RoleEnum role)
    {
        return Enum.TryParse(roleName, ignoreCase: true, out role) &&
               role != RoleEnum.All &&
               Enum.IsDefined(role);
    }
}
