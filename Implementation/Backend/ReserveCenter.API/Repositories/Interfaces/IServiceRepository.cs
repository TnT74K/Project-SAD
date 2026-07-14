using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IServiceRepository
{
    Task<Orgservice?> GetByIdAsync(int serviceId);

    //برای زمانی که ما می خواهم لیست سرویس های یک کسب و کار رو نشون بدیم
    Task<List<Orgservice>> GetByOrgIdAsync(int orgId);

    Task<Orgservice> CreateAsync(Orgservice service);

    Task<bool> UpdateAsync(Orgservice service);

    Task<bool> DeleteAsync(int serviceId);

    // چک تکراری بودن یا نبودن سرویس که می خواند ثبت بشه
    Task<bool> CheckByOrgAndNameAsync(int orgId, string name);

    // بررسی وجود خدمت با ای دی مشخص در سازمان
    Task<bool> ExistByOrgIdAndServiceIdAsync(int serviceId, int orgId);

}
