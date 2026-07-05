namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class LoginRequest
    {
        public string PhoneNumber { get; set; }    // شماره تلفن (نام کاربری)
        public string Password { get; set; }       // رمز عبور
        public bool RememberMe { get; set; }       // مرا به خاطر بسپار
    }
}