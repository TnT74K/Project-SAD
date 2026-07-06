using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Service;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IOrgRepository _orgRepository;

        public ServiceService(IServiceRepository serviceRepository, IOrgRepository orgRepository)
        {
            _serviceRepository = serviceRepository;
            _orgRepository = orgRepository;
        }

        public async Task<List<ServiceDto>> GetServicesByOrgIdAsync(int orgId)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            var services = await _serviceRepository.GetByOrgIdAsync(orgId);

            return services.Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                TimeDuration = s.TimeDuration,
                OrgId = s.OrgId,
                OrgName = org.Name
            }).ToList();
        }

        public async Task<ServiceDto> GetServiceByIdAsync(int serviceId, int orgId)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null)
                throw new KeyNotFoundException("خدمت مورد نظر یافت نشد.");

            if (service.OrgId != orgId)
                throw new UnauthorizedAccessException("شما دسترسی به این خدمت ندارید.");

            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                TimeDuration = service.TimeDuration,
                OrgId = service.OrgId,
                OrgName = org.Name
            };
        }

        public async Task<ServiceDto> CreateServiceAsync(int orgId, ServiceCreateRequest request)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            var exists = await _serviceRepository.ExistsByOrgAndNameAsync(orgId, request.Name.Trim());
            if (exists)
                throw new InvalidOperationException("خدمتی با این نام قبلاً ثبت شده است.");

            var service = new Orgservice
            {
                Name = request.Name.Trim(),
                TimeDuration = request.TimeDuration,
                OrgId = orgId,
                IsDeleted = false
            };

            var createdService = await _serviceRepository.AddAsync(service);

            return new ServiceDto
            {
                Id = createdService.Id,
                Name = createdService.Name,
                TimeDuration = createdService.TimeDuration,
                OrgId = createdService.OrgId,
                OrgName = org.Name
            };
        }

        public async Task<bool> UpdateServiceAsync(int orgId, ServiceUpdateRequest request)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            var exists = await _serviceRepository.ExistsByIdAndOrgAsync(request.Id, orgId);
            if (!exists)
                throw new KeyNotFoundException("خدمت مورد نظر یافت نشد یا به این سازمان تعلق ندارد.");

            var service = new Orgservice
            {
                Id = request.Id,
                Name = request.Name.Trim(),
                TimeDuration = request.TimeDuration,
                OrgId = orgId,
                IsDeleted = false
            };

            return await _serviceRepository.UpdateAsync(service);
        }

        public async Task<bool> DeleteServiceAsync(int serviceId, int orgId)
        {
            var org = await _orgRepository.GetByIdAsync(orgId);
            if (org == null)
                throw new KeyNotFoundException("سازمان مورد نظر یافت نشد.");

            var exists = await _serviceRepository.ExistsByIdAndOrgAsync(serviceId, orgId);
            if (!exists)
                throw new KeyNotFoundException("خدمت مورد نظر یافت نشد یا به این سازمان تعلق ندارد.");

            return await _serviceRepository.DeleteAsync(serviceId);
        }
    }
}