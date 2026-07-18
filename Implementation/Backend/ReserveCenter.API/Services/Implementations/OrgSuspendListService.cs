using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations;

public class OrgSuspendListService : IOrgSuspendListService
{
    private readonly IOrgRepository _orgRepository;

    public OrgSuspendListService(IOrgRepository orgRepository)
    {
        _orgRepository = orgRepository;
    }

    public async Task<List<OrgSuspendDto>> ShowAllOrgsAsync()
    {
        var orgs = await _orgRepository.GetAllOrgWithDetailAsync();

        if (orgs is null)
        {
            return new List<OrgSuspendDto>();
        }

        return orgs
            .Where(org => !org.IsDeleted)
            .Select(org => new OrgSuspendDto // DTO mapping
            {
                Id = org.Id,
                Name = org.Name,
                OrgType = org.Orgtype.Name,
                Owner = $"{org.CreatedByNavigation.FirstName} {org.CreatedByNavigation.LastName}",
                IsBanned = org.IsBanned
            })
            .ToList();
    }

    public async Task<bool> SuspendOrgAsync(int orgId)
    {
        var org = await _orgRepository.GetByIdAsync(orgId);

        if (org is null || org.IsBanned)
        {
            return false;
        }

        return await _orgRepository.ChangeBannedStatusAsync(orgId);
    }

    public async Task<bool> UnlockOrgAsync(int orgId)
    {
        var org = await _orgRepository.GetByIdAsync(orgId);

        if (org is null || !org.IsBanned)
        {
            return false;
        }

        return await _orgRepository.ChangeBannedStatusAsync(orgId);
    }
}