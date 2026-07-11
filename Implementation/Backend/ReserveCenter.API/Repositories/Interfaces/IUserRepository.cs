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

    //گرفتن برای اطلاعات کاربر برای پروفایل 
    Task<User?> GetWithDetailByIdAsync(int userId);

    //برای گرفتن همه نویت هایی که تا الان ایشون گرفته است
    Task<List<Appointment>?> GetAllUserAppointmentByUserIdAsync(int userId);
    // new methods for UserList service
    Task<bool> BlockUserAsync(int userId);

    Task<bool> UnblockUserAsync(int userId);

    Task<bool> UpdateUserByAdminAsync(User user);

}
