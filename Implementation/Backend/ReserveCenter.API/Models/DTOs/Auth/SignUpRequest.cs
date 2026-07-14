using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "نام الزامی است")]
        [StringLength(256, MinimumLength = 2, ErrorMessage = "نام باید بین 2 تا 256 کاراکتر باشد")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "نام خانوادگی الزامی است")]
        [StringLength(256, MinimumLength = 2, ErrorMessage = "نام خانوادگی باید بین 2 تا 256 کاراکتر باشد")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "شماره تلفن معتبر نیست (مثال: 09123456789)")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "رمز عبور باید حداقل 6 کاراکتر باشد")]
        public string Password { get; set; }

        public int? CityId { get; set; }

        public string Role { get; set; } = "Customer"; // قرار شد اولین نقش همه «مشتری» باشه
    }
}