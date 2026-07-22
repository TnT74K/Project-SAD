using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IStaffListRepository
{
    //برای ثبت کارمند با استفاده از شماره تلفن و نقش
    Task<StaffList> AddAsync(string phoneNumber, RoleEnum role, int orgId, int createBy);

    //برای بررسی درست بودن شماره موبایل
    Task<bool> CheckPhoneNumberIsExistAsync(string phoneNumber);

    Task<List<StaffList>?> SearchAsync(string searchPhrase);

    Task<StaffList?> GetByIdAsync(int staffListId);

    Task<List<StaffList>?> GetAllAsync(int orgId);

    //ویرایش
    Task<StaffList> EditAsync(int lastStaffListId, RoleEnum role, int modifiedBy);

    Task<bool> DeleteAsync(int staffListId, int orgId);

    Task<bool> ChangeStatusAsync(int staffListId, int orgId);

    Task<List<StaffList>> GetActiveAssignmentsByUserIdAsync(int userId);

    Task<bool> HasActiveAssignmentAsync(int userId, int roleId, int? orgId = null);
}
