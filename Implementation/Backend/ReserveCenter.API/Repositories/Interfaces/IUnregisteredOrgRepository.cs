using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IUnregisteredOrgRepository
{
    //برای فرستادن درخواست اولیه ثبت کسب و کار
    Task<UnregisteredOrg> AddAsync(UnregisteredOrg unregisteredOrg);

    //برای رد درخواست 
    Task<bool> RejectAsync(int unregisterdOrgId);

    //برای تایید درخواست 
    Task<bool> ApprovedAsync(int unregisterdOrgId);

    //برای تایید درخواست 
    Task<List<UnregisteredOrg>> GetAllAsync();

    Task<UnregisteredOrg?> GetByIdAsync(int unregisterdOrgId);

}
