using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Repositories.Interfaces;
using System.Security.Cryptography;

namespace ReserveCenter.API.Repositories.Implementations;

public class OrgRepository : IOrgRepository
{
    private readonly ReserveCenterDBContext _dbContext;

    public OrgRepository(ReserveCenterDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    //برای زمانی که ما یک درخواست ثبت کسب و کار رو می پذیریم
    //بعد مستقیما باید در این جدول قرار بگیره و نیازی به ثبت مجدد نباشه
    public async Task<Org> AddAsync(int unregisterdOrgId)
    {
        var existingUnregisteredOrg = await _dbContext.UnregisteredOrgs.FirstOrDefaultAsync(existing => existing.Id == unregisterdOrgId);

        if (existingUnregisteredOrg is null)
        {
            return null;
        }

        Org org = new Org();

        org.Name = existingUnregisteredOrg.Name;
        org.Image = existingUnregisteredOrg.Image;
        org.Description = existingUnregisteredOrg.Description;
        org.EstablishmentDate = existingUnregisteredOrg.EstablishmentDate;
        org.Orgtype = existingUnregisteredOrg.Orgtype;
        org.ActiveDaysPerWeek = existingUnregisteredOrg.ActiveDaysPerWeek;
        org.StartWorkTime = existingUnregisteredOrg.StartWorkTime;
        org.EndWorkTime = existingUnregisteredOrg.EndWorkTime;
        org.StartRestTime = existingUnregisteredOrg.StartRestTime;
        org.EndRestTime = existingUnregisteredOrg.EndRestTime;
        org.CityId = existingUnregisteredOrg.CityId;
        org.CreatedBy = existingUnregisteredOrg.CreatedBy;
        org.CreatedDate = existingUnregisteredOrg.CreatedDate;
        org.IsPremier = false;
        org.SuccessAppointmentCount = 0;
        org.StarCount = 0;
        org.VoterCount = 0;
        org.IsActive = true;
        org.IsBanned = false;
        org.IsDeleted = false;

        await _dbContext.Orgs.AddAsync(org);
        await _dbContext.SaveChangesAsync();
        return org;
    }

    public async Task<bool> ChangeActiveStatusAsync(int orgId)
    {
        var existingOrg = await _dbContext.Orgs.FirstOrDefaultAsync(existing => existing.Id == orgId);

        if (existingOrg is null)
        {
            return false;
        }

        existingOrg.IsActive = !existingOrg.IsActive;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangeBannedStatusAsync(int orgId)
    {
        var existingOrg = await _dbContext.Orgs.FirstOrDefaultAsync(existing => existing.Id == orgId);

        if (existingOrg is null)
        {
            return false;
        }

        existingOrg.IsBanned = !existingOrg.IsBanned;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int orgId)
    {
        var org = await _dbContext.Orgs
            .FirstOrDefaultAsync(existing => existing.Id == orgId);

        if (org is null)
        {
            return false;
        }

        org.IsDeleted = true;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    // برای برای گرفتن پروفایل کسب و کار مدنظر
    public async Task<Org?> GetByIdAsync(int orgId)
    {
        return await _dbContext.Orgs
                               .AsNoTracking()
                               .FirstOrDefaultAsync(org => org.Id == orgId && org.IsDeleted == false);
    }

    public async Task<Org?> GetWithDetailsByIdAsync(int orgId)
    {
        return await _dbContext.Orgs
            .AsNoTracking()
            .Include(org => org.City)
            .Include(org => org.Orgtype)
            .Include(org => org.CreatedByNavigation)
            .FirstOrDefaultAsync(org => org.Id == orgId && org.IsDeleted == false);
    }


    public async Task<bool> UpdateAsync(Org org)
    {
        var existingOrg = await _dbContext.Orgs.FirstOrDefaultAsync(existing => existing.Id == org.Id);

        if (existingOrg is null)
        {
            return false;
        }

        existingOrg.Name = org.Name;
        existingOrg.Image = org.Image;
        existingOrg.Description = org.Description;
        existingOrg.EstablishmentDate = org.EstablishmentDate;
        existingOrg.Orgtype = org.Orgtype;
        existingOrg.ActiveDaysPerWeek = org.ActiveDaysPerWeek;
        existingOrg.StartWorkTime = org.StartWorkTime;
        existingOrg.EndWorkTime = org.EndWorkTime;
        existingOrg.StartRestTime = org.StartRestTime;
        existingOrg.EndRestTime = org.EndRestTime;
        existingOrg.CityId = org.CityId;
        existingOrg.CreatedBy = org.CreatedBy;
        existingOrg.CreatedDate = org.CreatedDate;
        existingOrg.IsPremier = org.IsPremier;
        existingOrg.SuccessAppointmentCount = org.SuccessAppointmentCount;
        existingOrg.StarCount = org.StarCount;
        existingOrg.VoterCount = org.VoterCount;
        existingOrg.IsActive = org.IsActive;
        existingOrg.IsBanned = org.IsBanned;
        existingOrg.IsDeleted = org.IsDeleted;
        //TODO : باید آی دی کاربری که داره این رو تغییر می ده پیدا کینم
        //existingOrg.ModifiedBy = ??
        //existingOrg.ModifiedDate = ??

        await _dbContext.SaveChangesAsync();
        return true;
    }
}
