using ReserveCenter.API.Models.DTOs.Admin.UserManage;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class AdminUserListService : IAdminUserListService
    {
        private readonly IUserRepository _userRepository;

        public AdminUserListService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Methods go here...
        public async Task<List<UserListDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.AllUserAsync();

            return users.Select(user => new UserListDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                IsBlocked = user.IsBlocked,
                IsDeleted = user.IsDeleted
                // Ignore CreatedDate for now
            }).ToList();
        }
        public Task<UserDetailDto?> GetUserDetailAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> BlockUserAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UnblockUserAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateUserAsync(UserDetailDto userDto)
        {
            throw new NotImplementedException();
        }
    }
}