using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IUnregisteredOrgRepository
{
    //برای فرستادن درخواست اولیه ثبت کسب و کار
    Task<UnregisteredOrg> AddAsync(UnregisteredOrg unregisteredOrg);

    //برای رد درخواست 
    Task<bool> RejectAsync(int unregisterdOrgId);

    //برای تایید درخواست 
    Task<bool> ApprovedAsync(int unregisterdOrgId);

    Task<List<UnregisteredOrg>> GetAllAsync();

    Task<UnregisteredOrg?> GetByIdAsync(int unregisterdOrgId);

    Task<List<UnregisteredOrg>?> SearchAsync(string searchPhrase, OrgTypeEnum orgTypeEnum);

}
