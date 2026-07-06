using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int userId);

    //برای زمانی که ما در صفحه لیست کاربران سرچ می کنیم
    Task<List<User>> SearchUserAsync(string searchPhrase);

    //برای زمانی که ما در صفحه لیست کاربران می خواهیم همه کاربران را نشان بدیم
    Task<List<User>> AllUserAsync();

    Task<User> CreateAsync(User user);

    //برای اپدیت از طریق صفحه پروفایل من
    Task<bool> UpdateUserProfileAsync(User user);

    Task<bool> DeleteAsync(int UserId);

}
