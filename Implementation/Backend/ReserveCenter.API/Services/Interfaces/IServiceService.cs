using ReserveCenter.API.Models.DTOs.Org.Service;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IServiceService
    {
        /// <summary>
        /// دریافت لیست خدمات یک سازمان
        /// </summary>
        Task<List<ServiceDto>> GetServicesByOrgIdAsync(int orgId);

        /// <summary>
        /// دریافت یک خدمت با شناسه
        /// </summary>
        Task<ServiceDto> GetServiceByIdAsync(int serviceId, int orgId);

        /// <summary>
        /// ایجاد خدمت جدید
        /// </summary>
        Task<ServiceDto> CreateServiceAsync(int orgId, ServiceCreateRequest request);

        /// <summary>
        /// ویرایش خدمت
        /// </summary>
        Task<bool> UpdateServiceAsync(int orgId, ServiceUpdateRequest request);

        /// <summary>
        /// حذف خدمت (نرم)
        /// </summary>
        Task<bool> DeleteServiceAsync(int serviceId, int orgId);
    }
}