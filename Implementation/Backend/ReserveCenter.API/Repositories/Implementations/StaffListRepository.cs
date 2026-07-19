using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Interfaces;
using System.Security.Cryptography;

namespace ReserveCenter.API.Repositories.Implementations
{
    public class StaffListRepository : IStaffListRepository
    {
        private readonly ReserveCenterDBContext _dbContext;

        public StaffListRepository(ReserveCenterDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<StaffList> AddAsync(string phoneNumber, RoleEnum role, int orgId, int createBy)
        {
            if (!await CheckPhoneNumberIsExistAsync(phoneNumber))
            {
                return new StaffList();
            }

            var user = _dbContext.Users.FirstOrDefault(x => x.PhoneNumber == phoneNumber);

            StaffList staffList = new StaffList();
            staffList.UserId = user.Id;
            staffList.RoleId = (int)role;
            staffList.OrgId = orgId;
            staffList.IsActive = true;
            staffList.CreatedBy = createBy;
            staffList.CreatedDate = DateTime.Now;

            await _dbContext.StaffLists.AddAsync(staffList);
            await _dbContext.SaveChangesAsync();

            return staffList;
        }

        public async Task<bool> ChangeStatusAsync(int staffListId, int orgId)
        {
            var staffList = _dbContext.StaffLists.FirstOrDefault(x => x.Id == staffListId && x.OrgId == orgId);

            if (staffList is null)
            {
                return false;
            }

            staffList.IsActive = !staffList.IsActive;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<StaffList?> GetByIdAsync(int staffListId)
        {
            return await _dbContext.StaffLists
                .AsNoTracking()
                .Include(i => i.Org)
                .Include(i => i.Role)
                .Include(i => i.User)
                .FirstOrDefaultAsync(x => x.Id == staffListId);
        }

        public async Task<bool> CheckPhoneNumberIsExistAsync(string phoneNumber)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.PhoneNumber == phoneNumber);

            if (user is null)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> DeleteAsync(int staffListId, int orgId)
        {
            var staffList = _dbContext.StaffLists.FirstOrDefault(x => x.Id == staffListId && x.OrgId == orgId);

            if (staffList is null)
            {
                return false;
            }

            _dbContext.StaffLists.Remove(staffList);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<StaffList> EditAsync(int lastStaffListId, RoleEnum role, int modifiedBy)
        {
            var staffList = _dbContext.StaffLists.FirstOrDefault(x => x.Id == lastStaffListId);

            if (staffList is null)
            {
                return new StaffList();
            }

            staffList.RoleId = (int)role;
            staffList.ModifiedBy = modifiedBy;
            staffList.ModifiedDate = DateTime.Now;
            await _dbContext.SaveChangesAsync();

            return staffList;

        }

        public async Task<List<StaffList>?> GetAllAsync(int orgId)
        {
            return await _dbContext.StaffLists
                                   .AsNoTracking()
                                   .Include(i => i.Org)
                                   .Include(i => i.Role)
                                   .Include(i => i.User)
                                   .Where(staff => staff.OrgId == orgId)
                                   .OrderBy(service => service.Id)
                                   .ToListAsync();
        }

        public async Task<List<StaffList>?> SearchAsync(string searchPhrase)
        {
            return await _dbContext.StaffLists
                                   .AsNoTracking()
                                   .Include(i => i.Org)
                                   .Include(i => i.Role)
                                   .Include(i => i.User)
                                   .Where(w => w.User.FirstName.Contains(searchPhrase) || w.User.LastName.Contains(searchPhrase) || w.User.PhoneNumber.Contains(searchPhrase))
                                   .OrderBy(o => o.Id)
                                   .ToListAsync();
        }

        public async Task<List<StaffList>> GetActiveAssignmentsByUserIdAsync(int userId)
        {
            return await _dbContext.StaffLists
                .AsNoTracking()
                .Include(staffList => staffList.Org)
                .Where(staffList => staffList.UserId == userId && staffList.IsActive)
                .ToListAsync();
        }

        public async Task<bool> HasActiveAssignmentAsync(int userId, int roleId, int? orgId = null)
        {
            return await _dbContext.StaffLists.AnyAsync(staffList =>
                staffList.UserId == userId &&
                staffList.RoleId == roleId &&
                staffList.IsActive &&
                (!orgId.HasValue || staffList.OrgId == orgId.Value));
        }
    }
}
