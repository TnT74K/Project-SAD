using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Repositories.Interfaces;
using System.Security.Cryptography;

namespace ReserveCenter.API.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly ReserveCenterDBContext _dbContext;

    public UserRepository(ReserveCenterDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _dbContext.Users
                               .AsNoTracking()
                               .FirstOrDefaultAsync(user => user.Id == userId && user.IsDeleted == false);
    }

    public async Task<User> CreateAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }

    //برای اپدیت از طریق صفحه پروفایل من
    public async Task<bool> UpdateUserProfileAsync(User user)
    {
        var existingUser = await _dbContext.Users.FirstOrDefaultAsync(existing => existing.Id == user.Id);

        if (existingUser is null)
        {
            return false;
        }

        existingUser.FirstName = user.FirstName;
        existingUser.LastName = user.LastName;
        existingUser.NationalCode = user.NationalCode;
        existingUser.CityId = user.CityId;
        existingUser.ModifiedBy = user.ModifiedBy;
        existingUser.ModifiedDate = DateTime.Now;


        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(existing => existing.Id == userId);

        if (user is null)
        {
            return false;
        }

        user.IsDeleted = true;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    //برای زمانی که ما در صفحه لیست کاربران سرچ می کنیم
    public async Task<List<User>> SearchUserAsync(string searchPhrase)
    {
        return await _dbContext.Users
                        .AsNoTracking()
                        .Where(user => user.FirstName.Contains(searchPhrase) || user.LastName.Contains(searchPhrase) || user.PhoneNumber.Contains(searchPhrase))
                        .OrderBy(user => user.Id)
                        .ToListAsync();
    }

    //برای زمانی که ما در صفحه لیست کاربران می خواهیم همه کاربران را نشان بدیم
    public async Task<List<User>> AllUserAsync()
    {
        return await _dbContext.Users
                        .AsNoTracking()
                        .OrderBy(user => user.Id)
                        .ToListAsync();
    }

    public async Task<User?> GetWithDetailByIdAsync(int userId)
    {
        return await _dbContext.Users
                               .AsNoTracking()
                               .Include(user => user.City)
                               .Include(user => user.ModifiedByNavigation)
                               .FirstOrDefaultAsync(user => user.Id == userId && user.IsDeleted == false);
    }

    public async Task<List<Appointment>?> GetAllUserAppointmentByUserIdAsync(int userId)
    {
        return await _dbContext.Appointments
                               .AsNoTracking()
                               .Include(i => i.AppointmentStatus)
                               .Include(i => i.BookingUser)
                               .Include(i => i.Org)
                               .Include(i => i.Orgservice)
                               .Where(appo => appo.BookingUserId == userId)
                               .ToListAsync();
    }
}
