// DTO mapping is done in service layer
using ReserveCenter.API.Models.DTOs.Admin.UserManage;
using ReserveCenter.API.DatabaseModels;
namespace ReserveCenter.API.Services.Interfaces;

public interface IAdminUserListService
{
    Task<List<UserListDto>> GetAllUsersAsync();

    Task<UserDetailDto?> GetUserDetailAsync(int userId);

    Task<bool> BlockUserAsync(int userId);

    Task<bool> UnblockUserAsync(int userId);

    Task<bool> UpdateUserAsync(UserDetailDto userDto);
}