using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Profile;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class OrgProfileService : IOrgProfileService
    {
        private readonly IOrgRepository _orgRepository;

        public OrgProfileService(IOrgRepository orgRepository)
        {
            _orgRepository = orgRepository;
        }

        public async Task<OrgProfileDto> GetProfileByOrgIdAsync(int orgId)
        {
            // دریافت سازمان بر اساس UserId
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمانی برای این کاربر یافت نشد.");

            // دریافت اطلاعات کامل (City, OrgType, User)
            org = await _orgRepository.GetWithDetailsByIdAsync(org.Id);
            if (org == null)
                throw new KeyNotFoundException("سازمانی برای این کاربر یافت نشد.");

            return new OrgProfileDto
            {
                Id = org.Id,
                Name = org.Name,
                Image = org.Image,
                Description = org.Description,
                EstablishmentDate = org.EstablishmentDate,
                OrgTypeName = org.Orgtype?.Name ?? "نامشخص",
                ActiveDaysPerWeek = org.ActiveDaysPerWeek,
                StartWorkTime = org.StartWorkTime,
                EndWorkTime = org.EndWorkTime,
                StartRestTime = org.StartRestTime,
                EndRestTime = org.EndRestTime,
                CityName = org.City?.Name ?? "نامشخص",
                Address = org.Address,
                IsPremier = org.IsPremier,
                SuccessAppointmentCount = org.SuccessAppointmentCount,
                StarCount = org.StarCount,
                IsActive = org.IsActive,
                IsBanned = org.IsBanned
            };
        }

        public async Task<bool> UpdateProfileAsync(int orgId, int modifiedBy, OrgProfileEditRequest request)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمانی برای این کاربر یافت نشد.");

            org.Name = request.Name;
            org.Image = request.Image;
            org.Description = request.Description;
            org.EstablishmentDate = request.EstablishmentDate;
            org.OrgtypeId = request.OrgtypeId;
            org.ActiveDaysPerWeek = request.ActiveDaysPerWeek;
            org.StartWorkTime = request.StartWorkTime;
            org.EndWorkTime = request.EndWorkTime;
            org.StartRestTime = request.StartRestTime ?? TimeOnly.MinValue;
            org.EndRestTime = request.EndRestTime ?? TimeOnly.MinValue;
            org.CityId = request.CityId;
            org.Address = request.Address;
            org.ModifiedBy = modifiedBy;
            org.ModifiedDate = DateTime.Now;

            return await _orgRepository.UpdateAsync(org);
        }


    }
}