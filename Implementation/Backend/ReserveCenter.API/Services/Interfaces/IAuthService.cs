using System.Threading.Tasks;
using ReserveCenter.API.Models.DTOs.Auth;
using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IAuthService
    {
        // ثبت‌نام
        Task<TokenResponse> RegisterAsync(SignUpRequest request);
        
        // ورود
        Task<LoginResponse> LoginAsync(LoginRequest request);

        // انتخاب نقش بعد ورود
        Task<TokenResponse> SelectRoleAsync(int userId, string roleName, int? orgId);
        // بازیابی رمز عبور
        Task<bool> ForgotPasswordAsync(string phoneNumber);
        Task<string> VerifyOtpAsync(string phoneNumber, string otpCode);
        Task<bool> ResetPasswordAsync(string phoneNumber, string token, string newPassword);
        
        // خروج
        Task<bool> LogoutAsync(int userId);
        
        // توکن
        Task<TokenResponse> RefreshTokenAsync(string refreshToken);

        // JWT Token
        string GenerateJwtToken(User user, string role, int? orgId = null);
        
        // کاربر
        Task<bool> ValidateUserAsync(int userId, string? role = null);
        Task<UserInfoDto> GetUserByIdAsync(int userId);
    }
}