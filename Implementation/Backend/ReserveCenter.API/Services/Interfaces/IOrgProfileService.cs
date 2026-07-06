using ReserveCenter.API.Models.DTOs.Org.Profile;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IOrgProfileService
    {
        /// <summary>
        /// دریافت پروفایل سازمان بر اساس شناسه کاربر (مدیر سازمان)
        /// </summary>
        Task<OrgProfileDto> GetProfileByUserIdAsync(int userId);

        /// <summary>
        /// ویرایش کامل پروفایل سازمان
        /// </summary>
        Task<bool> UpdateProfileAsync(int userId, OrgProfileEditRequest request);
    }
}