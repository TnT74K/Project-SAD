using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.User
{
    public class UpdateUserRequest
    {
        [Required(ErrorMessage = "نام الزامی است")]
        [StringLength(256, MinimumLength = 2, ErrorMessage = "نام باید بین 2 تا 256 کاراکتر باشد")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "نام خانوادگی الزامی است")]
        [StringLength(256, MinimumLength = 2, ErrorMessage = "نام خانوادگی باید بین 2 تا 256 کاراکتر باشد")]
        public string LastName { get; set; }

        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "کد ملی باید 10 رقم باشد")]
        public string NationalCode { get; set; }

        public int? CityId { get; set; }

        public string ProfileImage { get; set; }       // آدرس تصویر (اختیاری)
    }
}