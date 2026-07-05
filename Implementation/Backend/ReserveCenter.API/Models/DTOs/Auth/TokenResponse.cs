namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class TokenResponse
    {
        public bool IsSuccess { get; set; }        // آیا عملیات موفق بود؟
        public string Message { get; set; }        // پیام به کاربر
        public string Token { get; set; }          // توکن JWT
        public string RefreshToken { get; set; }   // توکن بازنشانی
        public DateTime ExpiresAt { get; set; }    // زمان انقضای توکن
        public UserInfoDto User { get; set; }      // اطلاعات کاربر
    }

    public class UserInfoDto
    {
        public int Id { get; set; }                // شناسه کاربر
        public string FirstName { get; set; }      // نام کاربر
        public string LastName { get; set; }       // نام خانوادگی کاربر
        public string PhoneNumber { get; set; }    // شماره تلفن
        public string Role { get; set; }           // نقش کاربر
        public bool IsBlocked { get; set; }        // آیا مسدود است؟
        public bool IsDeleted { get; set; }        // آیا حذف شده است؟
    }
}