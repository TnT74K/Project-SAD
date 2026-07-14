using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "رمز عبور الزامی است")]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}