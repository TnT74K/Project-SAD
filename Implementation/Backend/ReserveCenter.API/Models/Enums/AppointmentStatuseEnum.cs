using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.Enums
{
    public enum AppointmentStatuseEnum
    {
        [Display(Name = "همه موارد")]
        All = 0,

        [Display(Name = "حضور یافته")]
        Presenced = 1,

        [Display(Name = "لغو شده")]
        Canceled = 2,

        [Display(Name = "عدم حضور")]
        Absented = 3,
    }
}
