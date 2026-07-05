namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class SignUpRequest
    {
        public string FirstName { get; set; }      // نام کاربر
        public string LastName { get; set; }       // نام خانوادگی کاربر
        public string PhoneNumber { get; set; }    // شماره تلفن (نام کاربری)
        public string Password { get; set; }       // رمز عبور (ساده)
        public string NationalCode { get; set; }   // کد ملی (اختیاری)
        public int? CityId { get; set; }           // شناسه شهر (اختیاری)
        public string Role { get; set; }           // نقش کاربر (پیش‌فرض User)
    }
}