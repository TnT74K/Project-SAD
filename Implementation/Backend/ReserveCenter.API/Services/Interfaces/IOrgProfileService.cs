using ReserveCenter.API.Models.DTOs.Org.Profile;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IOrgProfileService
    {
        //TODO : در اصل در توکنی که سجاد برای فرد ایجاد می کنه ای دی اون  کسب و کار هم هستش
        //چون ممکنه که یک نفر بیشتر از یک کسب وکار داشته باشه ؛ با استفاده از توکن می توانیم اطلاعات کسب  و کار رو لود کنیم


        ///// <summary>
        ///// دریافت پروفایل سازمان بر اساس شناسه کاربر (مدیر سازمان)
        ///// </summary>
        //Task<OrgProfileDto> GetProfileByUserIdAsync(int userId);

        ///// <summary>
        ///// ویرایش کامل پروفایل سازمان
        ///// </summary>
        //Task<bool> UpdateProfileAsync(int userId, OrgProfileEditRequest request);
    }
}