using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class OtpVerifyRequest
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "کد تأیید الزامی است")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "کد تأیید باید 6 رقم باشد")]
        [RegularExpression(@"^[0-9]{6}$", ErrorMessage = "کد تأیید باید عددی باشد")]
        public string OtpCode { get; set; }
    }
}