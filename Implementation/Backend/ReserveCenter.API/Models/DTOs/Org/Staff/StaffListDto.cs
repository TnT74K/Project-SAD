namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffDto
    {
        public int Id { get; set; }                     // شناسه کارمند (StaffList.Id)
        public int UserId { get; set; }                 // شناسه کاربر
        public string FirstName { get; set; }           // نام
        public string LastName { get; set; }            // نام خانوادگی
        public string FullName { get; set; }            // نام کامل (برای نمایش)
        public string PhoneNumber { get; set; }         // شماره تلفن
        public int RoleId { get; set; }                 // شناسه نقش
        public string RoleName { get; set; }            // نام نقش (برای نمایش)
        public int OrgId { get; set; }                  // شناسه سازمان
        public string OrgName { get; set; }             // نام سازمان
        public bool IsActive { get; set; }              // فعال است؟
        public DateTime CreatedDate { get; set; }       // تاریخ ثبت
    }
}