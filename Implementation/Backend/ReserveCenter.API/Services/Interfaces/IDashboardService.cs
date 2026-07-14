using ReserveCenter.API.Models.DTOs.Org.Admin;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IDashboardService
    {
        /// <summary>
        /// دریافت داشبورد مدیریت سازمان
        /// </summary>
        Task<OrgAdminDashboardDto> GetOrgDashboardAsync(int orgId);
    }
}