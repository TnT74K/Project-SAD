using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.PublicOrgProfile;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations;

public class PublicOrgProfileService : IPublicOrgProfileService
{
    private readonly IOrgRepository _orgRepository;
    private readonly IServiceRepository _serviceRepository;

    public PublicOrgProfileService(
        IOrgRepository orgRepository,
        IServiceRepository serviceRepository)
    {
        _orgRepository = orgRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<PublicOrgProfileDto?> GetOrgProfileAsync(int orgId)
    {
        Org? org = await _orgRepository.GetWithDetailsByIdAsync(orgId);

        if (org is null)
            return null;

        var services = await _serviceRepository.GetByOrgIdAsync(orgId);

        var dto = new PublicOrgProfileDto
        {
            Id = org.Id,
            Name = org.Name,
            Description = org.Description,
            Address = org.Address,
            Image = org.Image,

            StarCount = org.StarCount,
            VoterCount = org.VoterCount,

            SuccessAppointmentCount = org.SuccessAppointmentCount,
            IsPremier = org.IsPremier,
            IsActive = org.IsActive,
            StartWorkTime = org.StartWorkTime.ToString("HH:mm"),
            EndWorkTime = org.EndWorkTime.ToString("HH:mm"),

            Services = services.Select(service => new PublicServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                TimeDuration = service.TimeDuration

            }).ToList()

        };

        return dto;
    }

    public async Task<List<PublicServiceDto>> GetServicesAsync(int orgId)
    {
        var services = await _serviceRepository.GetByOrgIdAsync(orgId);

        return services
            .Select(service => new PublicServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                TimeDuration = service.TimeDuration
            })
            .ToList();
    }
}
