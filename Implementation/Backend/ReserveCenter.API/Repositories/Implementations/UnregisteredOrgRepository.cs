using Microsoft.EntityFrameworkCore;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Interfaces;
using System.Security.Cryptography;

namespace ReserveCenter.API.Repositories.Implementations
{
    public class UnregisteredOrgRepository : IUnregisteredOrgRepository
    {
        private readonly ReserveCenterDBContext _dbContext;
        private readonly IOrgRepository _orgRepository;

        public UnregisteredOrgRepository(IOrgRepository orgRepository, ReserveCenterDBContext dbContext)
        {
            _orgRepository = orgRepository;
            _dbContext = dbContext;
        }

        public async Task<UnregisteredOrg> AddAsync(UnregisteredOrg unregisteredOrg)
        {
            await _dbContext.UnregisteredOrgs.AddAsync(unregisteredOrg);
            await _dbContext.SaveChangesAsync();

            return unregisteredOrg;
        }

        public async Task<bool> ApprovedAsync(int unregisterdOrgId)
        {
            var existingUnregisterdOrg = await _dbContext.UnregisteredOrgs.FirstOrDefaultAsync(existing => existing.Id == unregisterdOrgId);

            if (existingUnregisterdOrg is null)
            {
                return false;
            }

            await _orgRepository.AddAsync(unregisterdOrgId);

            return true;
        }

        public async Task<List<UnregisteredOrg>> GetAllAsync()
        {
            return await _dbContext.UnregisteredOrgs
                        .AsNoTracking()
                        .Include(i => i.City)
                        .Include(i => i.Orgtype)
                        .Include(i => i.CreatedByNavigation)
                        .OrderBy(o => o.Id)
                        .ToListAsync();
        }

        public async Task<UnregisteredOrg?> GetByIdAsync(int unregisterdOrgId)
        {
            return await _dbContext.UnregisteredOrgs
                       .AsNoTracking()
                       .Include(i => i.City)
                       .Include(i => i.Orgtype)
                       .Include(i => i.CreatedByNavigation)
                       .FirstOrDefaultAsync(x => x.Id == unregisterdOrgId);
        }

        public async Task<bool> RejectAsync(int unregisterdOrgId)
        {
            var unregisterdOrg = await _dbContext.UnregisteredOrgs
                .FirstOrDefaultAsync(existing => existing.Id == unregisterdOrgId);

            if (unregisterdOrg is null)
            {
                return false;
            }

            _dbContext.UnregisteredOrgs.Remove(unregisterdOrg);

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<List<UnregisteredOrg>?> SearchAsync(string searchPhrase, OrgTypeEnum orgTypeEnum)
        {
            //اگر دسته بندی خاصی انتخاب نشده بود 
            if (orgTypeEnum == OrgTypeEnum.All)
            {
                return await _dbContext.UnregisteredOrgs
                .AsNoTracking()
                .Include(i => i.City)
                .Include(i => i.Orgtype)
                .Include(i => i.CreatedByNavigation)
                .Where(w => w.Name.Contains(searchPhrase) || w.CreatedByNavigation.FirstName.Contains(searchPhrase) || w.CreatedByNavigation.LastName.Contains(searchPhrase) || w.City.Name.Contains(searchPhrase))
                .OrderBy(o => o.Id)
                .ToListAsync();
            }
            // اگر دسته بندی خاصی مدنظر بود
            else
            {
                return await _dbContext.UnregisteredOrgs
                .AsNoTracking()
                .Include(i => i.City)
                .Include(i => i.Orgtype)
                .Include(i => i.CreatedByNavigation)
                .Where(w => (w.Name.Contains(searchPhrase) || w.CreatedByNavigation.FirstName.Contains(searchPhrase) || w.CreatedByNavigation.LastName.Contains(searchPhrase) || w.City.Name.Contains(searchPhrase)) && w.OrgtypeId == (int)orgTypeEnum)
                .OrderBy(o => o.Id)
                .ToListAsync();
            }

        }
    }
}