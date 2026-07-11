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
        public async Task<UserDetailDto?> GetUserDetailAsync(int userId)
        {
            var user = await _userRepository.GetWithDetailByIdAsync(userId);

            if (user is null)
            {
                return null;
            }

            return new UserDetailDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                NationalCode = user.NationalCode,
                Password = user.Password,
                IsBlocked = user.IsBlocked,
                IsDeleted = user.IsDeleted
            };
        }
        
        public async Task<bool> BlockUserAsync(int userId)
        {
            return await _userRepository.BlockUserAsync(userId);
        }

        public async Task<bool> UnblockUserAsync(int userId)
        {
            return await _userRepository.UnblockUserAsync(userId);
        }

        public async Task<bool> UpdateUserAsync(UserDetailDto userDto)
        {
            var user = new DatabaseModels.User
            {
                Id = userDto.Id,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                NationalCode = userDto.NationalCode,
                Password = userDto.Password
            };

            return await _userRepository.UpdateUserByAdminAsync(user);
        }
    }
}