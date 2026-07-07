namespace ReserveCenter.API.Models.DTOs.Admin.UserManage
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }           // نام + نام خانوادگی
        public string PhoneNumber { get; set; }
        public string Role { get; set; }               // نقش کاربر
        public bool IsBlocked { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}