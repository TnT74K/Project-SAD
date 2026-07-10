namespace ReserveCenter.API.Models.DTOs.Admin.UserManage
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsDeleted { get; set; } // used for internal logic
        public DateTime CreatedDate { get; set; } // to use for future frontend UI
    }
}