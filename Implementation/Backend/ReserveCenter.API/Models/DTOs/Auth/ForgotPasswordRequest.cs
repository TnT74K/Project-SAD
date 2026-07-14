using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
        public string PhoneNumber { get; set; }
    }
}