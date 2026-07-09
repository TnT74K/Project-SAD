using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.Enums
{
    public enum RoleEnum
    {
        [Display(Name = "همه موارد")]
        All = 0,

        [Display(Name = "ادمین")]
        SuperAdmin = 1,

        [Display(Name = "مدیر کسب و کار")]
        OrgAdmin = 2,

        [Display(Name = "پشتیبان کسب و کار")]
        OrgSupport = 3,

        [Display(Name = "پشتیبان کسب و کار")]
        Staff = 4,
    }
}
