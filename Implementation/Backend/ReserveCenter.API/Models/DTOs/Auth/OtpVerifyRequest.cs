using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Auth
{
    public class OtpVerifyRequest
    {
        [Required(ErrorMessage = "شماره تلفن الزامی است")]
        [RegularExpression(@"^09[0-9]{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "کد تأیید الزامی است")]
        [StringLength(5, MinimumLength = 5, ErrorMessage = "کد تأیید باید 5 رقم باشد")]
        [RegularExpression(@"^[0-9]{5}$", ErrorMessage = "کد تأیید باید عددی باشد")]
        public string OtpCode { get; set; }
    }
}