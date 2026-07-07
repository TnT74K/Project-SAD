namespace ReserveCenter.API.Models.DTOs.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalCode { get; set; }
        public string ProfileImage { get; set; }
        public int? CityId { get; set; }
        public string CityName { get; set; }           // نام شهر (برای نمایش)
        public bool IsBlocked { get; set; }
        public bool IsDeleted { get; set; }
        public string Role { get; set; }               // نقش کاربر (از StaffList)
    }
}