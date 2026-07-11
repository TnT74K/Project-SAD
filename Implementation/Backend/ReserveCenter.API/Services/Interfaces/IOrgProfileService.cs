using ReserveCenter.API.Models.DTOs.Org.Profile;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IOrgProfileService
    {

        /// <summary>
        /// دریافت پروفایل سازمان بر اساس شناسه کاربر (مدیر سازمان)
        /// </summary>
        Task<OrgProfileDto> GetProfileByOrgIdAsync(int orgId);

        /// <summary>
        /// ویرایش کامل پروفایل سازمان
        /// </summary>
        Task<bool> UpdateProfileAsync(int orgId, int modifiedBy, OrgProfileEditRequest request);
    }
}