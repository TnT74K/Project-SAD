using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.DTOs.Admin.OrgManage
{
    public class OrgApprovalDto
    {
        [Required(ErrorMessage = "شناسه سازمان ثبت‌نام نشده الزامی است")]
        public int UnregisteredOrgId { get; set; }

        public string AdminComment { get; set; }  // نظر ادمین (اختیاری)
    }

    public class OrgRejectDto
    {
        [Required(ErrorMessage = "شناسه سازمان ثبت‌نام نشده الزامی است")]
        public int UnregisteredOrgId { get; set; }

        [Required(ErrorMessage = "دلیل رد الزامی است")]
        [StringLength(500, ErrorMessage = "دلیل رد نمی‌تواند بیشتر از 500 کاراکتر باشد")]
        public string RejectReason { get; set; }
    }

    // برای لیست سازمان‌های در انتظار
    public class UnregisteredOrgListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }       // نام نوع سازمان
        public string OwnerName { get; set; }      // نام و نام خانوادگی کاربر ثبت‌کننده
        public string City { get; set; }           // نام شهر
        public string SubmitDate { get; set; }     // تاریخ ثبت (برای نمایش)
    }

    // برای جزئیات کامل یک سازمان در انتظار
    public class UnregisteredOrgDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public DateOnly EstablishmentDate { get; set; }
        public string OrgTypeName { get; set; }
        public string ActiveDaysPerWeek { get; set; }
        public TimeOnly StartWorkTime { get; set; }
        public TimeOnly EndWorkTime { get; set; }
        public TimeOnly? StartRestTime { get; set; }
        public TimeOnly? EndRestTime { get; set; }
        public string CityName { get; set; }
        public string Address { get; set; }
        public string OwnerName { get; set; }      // نام و نام خانوادگی کاربر ثبت‌کننده
        public string OwnerPhone { get; set; }     // شماره تلفن کاربر ثبت‌کننده
        public DateTime CreatedDate { get; set; }
    }
}