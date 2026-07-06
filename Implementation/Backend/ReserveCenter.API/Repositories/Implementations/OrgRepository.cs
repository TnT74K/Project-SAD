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

        org.Name = org.Name;
        org.Image = org.Image;
        org.Description = org.Description;
        org.EstablishmentDate = org.EstablishmentDate;
        org.Orgtype = org.Orgtype;
        org.ActiveDaysPerWeek = org.ActiveDaysPerWeek;
        org.StartWorkTime = org.StartWorkTime;
        org.EndWorkTime = org.EndWorkTime;
        org.StartRestTime = org.StartRestTime;
        org.EndRestTime = org.EndRestTime;
        org.CityId = org.CityId;
        org.CreatedBy = org.CreatedBy;
        org.CreatedDate = org.CreatedDate;
        org.IsPremier = false;
        org.SuccessAppointmentCount = 0;
        org.StarCount = 0;
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

    public async Task<Org?> GetByIdAsync(int orgId)
    {
        return await _dbContext.Orgs
                               .AsNoTracking()
                               .FirstOrDefaultAsync(service => service.Id == orgId && service.IsDeleted == false);
    }

    public async Task<bool> UpdateAsync(Org org)
    {
        var existingOrg = await _dbContext.Orgservices.FirstOrDefaultAsync(existing => existing.Id == org.Id);

        if (existingOrg is null)
        {
            return false;
        }

        org.Name = org.Name;
        org.Image = org.Image;
        org.Description = org.Description;
        org.EstablishmentDate = org.EstablishmentDate;
        org.Orgtype = org.Orgtype;
        org.ActiveDaysPerWeek = org.ActiveDaysPerWeek;
        org.StartWorkTime = org.StartWorkTime;
        org.EndWorkTime = org.EndWorkTime;
        org.StartRestTime = org.StartRestTime;
        org.EndRestTime = org.EndRestTime;
        org.CityId = org.CityId;
        org.CreatedBy = org.CreatedBy;
        org.CreatedDate = org.CreatedDate;
        org.IsPremier = org.IsPremier;
        org.SuccessAppointmentCount = org.SuccessAppointmentCount;
        org.StarCount = org.StarCount;
        org.IsActive = org.IsActive;
        org.IsBanned = org.IsBanned;
        org.IsDeleted = org.IsDeleted;
        //TODO : باید آی دی کاربری که داره این رو تغییر می ده پیدا کینم
        //org.ModifiedBy = ??
        //org.ModifiedDate = ??

        await _dbContext.SaveChangesAsync();
        return true;
    }
}
