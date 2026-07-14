namespace ReserveCenter.API.Models.DTOs.Admin.UserManage
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalCode { get; set; }
        public string Password { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsDeleted { get; set; }
    }
}