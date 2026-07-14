using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Models.DTOs.Org.Profile;
using ReserveCenter.API.Models.DTOs.Org.Staff;
using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface IStaffListService
    {

        /// <summary>
        /// نمایش همه کارمندان این کسب و کار
        /// </summary>
        Task<List<StaffListDto>?> GetAllStaffListListAsync(int orgId);

        /// <summary>
        /// جست و جو
        /// </summary>
        Task<List<StaffListDto>?> SearchAsync(string searchPhrease);

        /// <summary>
        /// ثبت کارمند
        /// </summary>
        Task<StaffListDto> AddAsync(StaffCreateRequest staffCreateRequest);

        /// <summary>
        /// ویرایش کارمند
        /// </summary>
        Task<StaffListDto> EditAsync(StaffUpdateRequest staffUpdateRequest);

        /// <summary>
        /// تغییر وضعیت
        /// </summary>
        Task<bool> ChangeStatusAsync(int staffListId);

        /// <summary>
        /// حذف
        /// </summary>
        Task<bool> DeleteAsync(int staffListId);


    }
}