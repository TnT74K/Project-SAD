using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Models.DTOs.Org.Profile;
using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IOrgApprovalListService
    {

        /// <summary>
        /// گرفتن کل لیست کسب و کار هایی که در سامانه ثبت شده اند
        /// </summary>
        Task<List<UnregisteredOrgListDto>> GetAllUnregisteredOrgListAsync();

        /// <summary>
        /// نمایش جزئیات یک کسب و کار که در لیست است
        /// </summary>
        Task<UnregisteredOrgDetailDto> GetByIdAsync(int id);

        /// <summary>
        /// تایید کردن یک کسب و کار
        /// </summary>
        Task<bool> ApprovalOrgAsync(int id);

        /// <summary>
        /// رد کردن یک کسب و کار
        /// </summary>
        Task<bool> RejectOrgAsync(int id);

        /// <summary>
        /// جست و جو 
        /// </summary>
        Task<List<UnregisteredOrgListDto>> SearchAsync(string searchPhrase , OrgTypeEnum orgTypeEnum = 0);

    }
}