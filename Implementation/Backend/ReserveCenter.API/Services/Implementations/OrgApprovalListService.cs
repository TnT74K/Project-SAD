using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Admin.OrgManage;
using ReserveCenter.API.Models.DTOs.Org.Profile;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Implementations;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class OrgApprovalListService : IOrgApprovalListService
    {
        private readonly IUnregisteredOrgRepository _unregisteredOrgRepository;
        private readonly IOrgRepository _orgRepository;

        public OrgApprovalListService(IUnregisteredOrgRepository unregisteredOrgRepository, IOrgRepository orgRepository)
        {
            _unregisteredOrgRepository = unregisteredOrgRepository;
            _orgRepository = orgRepository;
        }

        public async Task<bool> ApprovalOrgAsync(int id)
        {
            var unregiterdorg = await _unregisteredOrgRepository.GetByIdAsync(id);
            if (unregiterdorg == null)
                throw new KeyNotFoundException("سازمانی با این ای دی در خواست ثبت نداده است");

            await _orgRepository.AddAsync(id);

            return true;
        }

        public async Task<List<UnregisteredOrgListDto>> GetAllUnregisteredOrgListAsync()
        {
            var unregisteredOrgList = _unregisteredOrgRepository.GetAllAsync();
            if (unregisteredOrgList == null)
                return new List<UnregisteredOrgListDto>();

            List<UnregisteredOrgListDto> _unregisteredOrgListDtos = new List<UnregisteredOrgListDto>();

            foreach (var item in unregisteredOrgList.Result)
            {
                _unregisteredOrgListDtos.Add( new UnregisteredOrgListDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category = item.Orgtype.Name,
                    OwnerName = item.CreatedByNavigation.FirstName + " " + item.CreatedByNavigation.FirstName,
                    City = item.City.Name,
                    SubmitDate = item.EstablishmentDate.ToString(),
                });
            }

            return _unregisteredOrgListDtos;

        }

        public async Task<UnregisteredOrgDetailDto> GetByIdAsync(int id)
        {
            var unregiterdorg = await _unregisteredOrgRepository.GetByIdAsync(id);
            if (unregiterdorg == null)
                throw new KeyNotFoundException("سازمانی با این ای دی در خواست ثبت نداده است");
            return new UnregisteredOrgDetailDto
            { 
            Id = unregiterdorg.Id,
            Name = unregiterdorg.Name,
            Image = unregiterdorg.Image,
            Description = unregiterdorg.Description,
            EstablishmentDate = unregiterdorg.EstablishmentDate,
            OrgTypeName = unregiterdorg.Orgtype.Name,
            CityName = unregiterdorg.City.Name,
            Address = unregiterdorg.Address,
            OwnerName = unregiterdorg.CreatedByNavigation.FirstName + " " + unregiterdorg.CreatedByNavigation.LastName,
            CreatedDate = unregiterdorg.CreatedDate
            };
        }

        public async Task<bool> RejectOrgAsync(int id)
        {
            var unregiterdorg = await _unregisteredOrgRepository.GetByIdAsync(id);
            if (unregiterdorg == null)
                throw new KeyNotFoundException("سازمانی با این ای دی در خواست ثبت نداده است");

            return await _unregisteredOrgRepository.RejectAsync(id);
        }

        public async Task<List<UnregisteredOrgListDto>> SearchAsync(string searchPhrase, OrgTypeEnum orgTypeEnum = OrgTypeEnum.All)
        {
            var unregisteredOrgList = _unregisteredOrgRepository.SearchAsync(searchPhrase, orgTypeEnum);
            if (unregisteredOrgList == null)
                return new List<UnregisteredOrgListDto>();

            List<UnregisteredOrgListDto> _unregisteredOrgListDtos = new List<UnregisteredOrgListDto>();

            foreach (var item in unregisteredOrgList.Result)
            {
                _unregisteredOrgListDtos.Add(new UnregisteredOrgListDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category = item.Orgtype.Name,
                    OwnerName = item.CreatedByNavigation.FirstName + " " + item.CreatedByNavigation.FirstName,
                    City = item.City.Name,
                    SubmitDate = item.EstablishmentDate.ToString(),
                });
            }

            return _unregisteredOrgListDtos;
        }

    }
}