using ReserveCenter.API.DatabaseModels;
using ReserveCenter.API.Models.DTOs.Org.Staff;
using ReserveCenter.API.Models.Enums;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class StaffListService : IStaffListService
    {
        private readonly IStaffListRepository _staffListRepository;

        public StaffListService(IStaffListRepository staffListRepository)
        {
            _staffListRepository = staffListRepository;
        }

        public async Task<List<StaffListDto>?> GetAllStaffListListAsync(int orgId)
        {
            var staffList = await _staffListRepository.GetAllAsync(orgId);

            if (staffList is null || !staffList.Any())
            {
                return new List<StaffListDto>();
            }

            return staffList.Select(MapToDto).ToList();
        }

        public async Task<List<StaffListDto>?> SearchAsync(string searchPhrease)
        {
            var staffList = await _staffListRepository.SearchAsync(searchPhrease);

            if (staffList is null || !staffList.Any())
            {
                return new List<StaffListDto>();
            }

            return staffList.Select(MapToDto).ToList();
        }

        public async Task<StaffListDto> AddAsync(StaffCreateRequest staffCreateRequest)
        {
            var result = await _staffListRepository.AddAsync(
                staffCreateRequest.PhoneNumber,
                (RoleEnum)staffCreateRequest.RoleId,
                staffCreateRequest.OrgId,
                staffCreateRequest.CreatedBy);

            if (result == null || result.Id == 0)
            {
                return new StaffListDto();
            }

            return MapToDto(result);
        }

        public async Task<StaffListDto> EditAsync(StaffUpdateRequest staffUpdateRequest)
        {
            var result = await _staffListRepository.EditAsync(
                staffUpdateRequest.Id,
                (RoleEnum)staffUpdateRequest.RoleId,
                staffUpdateRequest.ModifiedBy);

            if (result == null || result.Id == 0)
            {
                return new StaffListDto();
            }

            return MapToDto(result);
        }

        public async Task<bool> ChangeStatusAsync(int staffListId)
        {
            return await _staffListRepository.ChangeStatusAsync(staffListId);
        }

        public async Task<bool> DeleteAsync(int staffListId)
        {
            return await _staffListRepository.DeleteAsync(staffListId);
        }

        private static StaffListDto MapToDto(StaffList staff)
        {
            return new StaffListDto
            {
                Id = staff.Id,
                OrgId = staff.OrgId,
                UserId = staff.UserId,
                RoleId = staff.RoleId,
                IsActive = staff.IsActive,
                CreatedDate = staff.CreatedDate,

                OrgName = staff.Org?.Name,
                RoleName = staff.Role?.Name,
                FirstName = staff.User?.FirstName,
                LastName = staff.User?.LastName,
                PhoneNumber = staff.User?.PhoneNumber
            };
        }
    }
}
