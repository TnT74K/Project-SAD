namespace ReserveCenter.API.Models.DTOs.Admin.UserManage
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalCode { get; set; }
        public string ProfileImage { get; set; }
        public int? CityId { get; set; }
        public string CityName { get; set; }
        public string Role { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsDeleted { get; set; }
        public int WrongPasswordCount { get; set; }
        public DateTime? NextTimeToLogin { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int AppointmentCount { get; set; }      // تعداد نوبت‌های کاربر
    }
}