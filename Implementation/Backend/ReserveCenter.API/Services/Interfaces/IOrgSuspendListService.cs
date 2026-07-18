using ReserveCenter.API.Models.DTOs.Admin.OrgManage;

namespace ReserveCenter.API.Services.Interfaces;

public interface IOrgSuspendListService
{
    Task<List<OrgSuspendDto>> ShowAllOrgsAsync();
    Task<bool> SuspendOrgAsync(int orgId);
    Task<bool> UnlockOrgAsync(int orgId);
}