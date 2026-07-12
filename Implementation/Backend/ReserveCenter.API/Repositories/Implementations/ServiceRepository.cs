using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Repositories.Interfaces;

namespace ReserveCenter.API.Repositories.Implementations;

public class ServiceRepository : IServiceRepository
{
    private readonly ReserveCenterDBContext _dbContext;

    public ServiceRepository(ReserveCenterDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Orgservice?> GetByIdAsync(int serviceId)
    {
        return await _dbContext.Orgservices
                               .AsNoTracking()
                               .FirstOrDefaultAsync(service => service.Id == serviceId && service.IsDeleted == false);
    }

    public async Task<List<Orgservice>> GetByOrgIdAsync(int orgId)
    {
        return await _dbContext.Orgservices
                               .AsNoTracking()
                               .Where(service => service.OrgId == orgId && service.IsDeleted == false)
                               .OrderBy(service => service.Id)
                               .ToListAsync();
    }

    public async Task<Orgservice> CreateAsync(Orgservice service)
    {
        await _dbContext.Orgservices.AddAsync(service);
        await _dbContext.SaveChangesAsync();

        return service;
    }

    public async Task<bool> UpdateAsync(Orgservice service)
    {
        var existingService = await _dbContext.Orgservices.FirstOrDefaultAsync(existing => existing.Id == service.Id);

        if (existingService is null)
        {
            return false;
        }

        existingService.Name = service.Name;
        existingService.TimeDuration = service.TimeDuration;
        existingService.OrgId = service.OrgId;
        existingService.IsDeleted = service.IsDeleted;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int serviceId)
    {
        var service = await _dbContext.Orgservices
            .FirstOrDefaultAsync(existing => existing.Id == serviceId);

        if (service is null)
        {
            return false;
        }

        service.IsDeleted = true;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    // چک تکراری بودن یا نبودن سرویس که می خواند ثبت بشه
    public async Task<bool> CheckByOrgAndNameAsync(int orgId, string name)
    {
        var service = await _dbContext.Orgservices
            .FirstOrDefaultAsync(existing => existing.OrgId == orgId && existing.Name == name.Trim());

        if (service is null)
        {
            return false;
        }

        return true;
    }

    // بررسی وجود خدمت با ای دی مشخص در سازمان
    public async Task<bool> ExistByOrgIdAndServiceIdAsync(int serviceId, int orgId)
    {
        var service = await _dbContext.Orgservices
            .FirstOrDefaultAsync(existing => existing.Id == serviceId && existing.OrgId == orgId);
        
        if (service is null)
        {
            return false;
        }

        return true;
    }
}
