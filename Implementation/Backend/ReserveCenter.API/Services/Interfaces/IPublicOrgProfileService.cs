using ReserveCenter.API.Models.DTOs.PublicOrgProfile;

namespace ReserveCenter.API.Services.Interfaces;

public interface IPublicOrgProfileService
{
    Task<PublicOrgProfileDto?> GetOrgProfileAsync(int orgId);

    Task<List<PublicServiceDto>> GetServicesAsync(int orgId);
}