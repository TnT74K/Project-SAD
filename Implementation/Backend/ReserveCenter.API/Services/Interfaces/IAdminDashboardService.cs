using ReserveCenter.API.Models.DTOs.Admin;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        /// <summary>
        /// دریافت داشبورد ادمین کل سیستم
        /// </summary>
        Task<AdminDashboardDto> GetAdminDashboardAsync();
    }
}