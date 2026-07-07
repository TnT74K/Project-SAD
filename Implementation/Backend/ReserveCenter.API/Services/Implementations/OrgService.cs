using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class OrgService : IOrgService
    {
        private readonly ReserveCenterDBContext _dbContext;
        private readonly IOrgRepository _orgRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<OrgService> _logger;

        public OrgService(
            ReserveCenterDBContext dbContext,
            IOrgRepository orgRepository,
            IUserRepository userRepository,
            ILogger<OrgService> logger)
        {
            _dbContext = dbContext;
            _orgRepository = orgRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<OrgRegisterResponseDto> RegisterOrgAsync(OrgRegisterRequest request, int userId)
        {
            try
            {
                // 1. بررسی وجود کاربر
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OrgRegisterResponseDto
                    {
                        IsSuccess = false,
                        Message = "کاربر یافت نشد"
                    };
                }

                // 2. بررسی تکراری نبودن نام سازمان (بدون IsDeleted چون این فیلد رو نداره)
                var existingOrg = await _dbContext.UnregisteredOrgs
                    .FirstOrDefaultAsync(o => o.Name == request.Name);

                if (existingOrg != null)
                {
                    return new OrgRegisterResponseDto
                    {
                        IsSuccess = false,
                        Message = "یک سازمان با این نام قبلاً ثبت شده است"
                    };
                }

                // 3. بررسی وجود OrgType و City
                var orgType = await _dbContext.Orgtypes.FindAsync(request.OrgtypeId);
                if (orgType == null)
                {
                    return new OrgRegisterResponseDto
                    {
                        IsSuccess = false,
                        Message = "نوع سازمان معتبر نیست"
                    };
                }

                var city = await _dbContext.Cities.FindAsync(request.CityId);
                if (city == null)
                {
                    return new OrgRegisterResponseDto
                    {
                        IsSuccess = false,
                        Message = "شهر معتبر نیست"
                    };
                }

                // 4. ایجاد سازمان موقت
                var unregisteredOrg = new UnregisteredOrg
                {
                    Name = request.Name,
                    Image = request.Image ?? "default-org.jpg",
                    Description = request.Description,
                    EstablishmentDate = request.EstablishmentDate,  // ✅ DateOnly -> DateOnly
                    OrgtypeId = request.OrgtypeId,
                    ActiveDaysPerWeek = request.ActiveDaysPerWeek,
                    StartWorkTime = request.StartWorkTime,          // ✅ TimeOnly -> TimeOnly
                    EndWorkTime = request.EndWorkTime,              // ✅ TimeOnly -> TimeOnly
                    StartRestTime = request.StartRestTime ?? new TimeOnly(0, 0),  // ✅ اگر null بود مقدار پیش‌فرض
                    EndRestTime = request.EndRestTime ?? new TimeOnly(0, 0),      // ✅ اگر null بود مقدار پیش‌فرض
                    CityId = request.CityId,
                    Address = request.Address,
                    CreatedDate = DateTime.Now,
                    CreatedBy = userId
                };

                await _dbContext.UnregisteredOrgs.AddAsync(unregisteredOrg);
                await _dbContext.SaveChangesAsync();

                return new OrgRegisterResponseDto
                {
                    IsSuccess = true,
                    Message = "درخواست ثبت سازمان با موفقیت ارسال شد. منتظر تأیید ادمین باشید.",
                    UnregisteredOrgId = unregisteredOrg.Id,
                    Status = "Pending",
                    CreatedDate = unregisteredOrg.CreatedDate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering organization for user {UserId}", userId);
                return new OrgRegisterResponseDto
                {
                    IsSuccess = false,
                    Message = "خطا در ثبت سازمان. لطفاً مجدداً تلاش کنید."
                };
            }
        }

        // ==============================
        // متدهای کمکی
        // ==============================
        public async Task<bool> IsOrgOwnerAsync(int orgId, int userId)
        {
            var org = await _dbContext.Orgs
                .FirstOrDefaultAsync(o => o.Id == orgId && !o.IsDeleted);

            if (org == null)
                return false;

            return org.CreatedBy == userId;
        }

        public async Task<bool> IsOrgExistAsync(int orgId)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            return org != null;
        }

        public async Task<Org?> GetOrgByIdAsync(int orgId)
        {
            return await _orgRepository.GetByIdAsync(orgId);
        }
    }
}