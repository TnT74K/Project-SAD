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

}
