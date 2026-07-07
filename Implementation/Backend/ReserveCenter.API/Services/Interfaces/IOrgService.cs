using ReserveCenter.API.Models.DTOs.Org;
using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IOrgService
    {
        // ==============================
        // ✅ ثبت سازمان (وظیفه شما)
        // ==============================
        Task<OrgRegisterResponseDto> RegisterOrgAsync(OrgRegisterRequest request, int userId);

        // ==============================
        // ✅ متدهای کمکی (برای استفاده دیگران)
        // ==============================
        Task<bool> IsOrgOwnerAsync(int orgId, int userId);
        Task<bool> IsOrgExistAsync(int orgId);
        Task<Org?> GetOrgByIdAsync(int orgId); // برای استفاده سایر سرویس‌ها
    }
}