using ReserveCenter.API.Models.DTOs.Search;
using ReserveCenter.API.Repositories.Interfaces;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Services.Implementations
{
    public class SearchService : ISearchService
    {
        private readonly IOrgRepository _orgRepository;

        public SearchService(IOrgRepository orgRepository)
        {
            _orgRepository = orgRepository;
        }

        public async Task<SearchResultDto> SearchAsync(SearchRequest request)
        {
            // 1. دریافت داده‌ها از ریپازیتوری با فیلترها
            var orgs = await _orgRepository.SearchWithDetailAsync(
                searchPhrase: request.Query ?? "",
                city: request.City,
                orgType: request.OrgType,
                upFourStar: request.UpFourStar,
                up500Appointment: request.Up500Appointment,
                hasAppointment: request.HasAppointment
            );

            if (orgs == null || !orgs.Any())
            {
                return new SearchResultDto
                {
                    Items = new List<OrgSearchResultDto>(),
                    TotalCount = 0,
                    Page = request.Page,
                    PageSize = request.PageSize
                };
            }

            // 2. ✅ مرتب‌سازی (در سرویس)
            var sortedOrgs = request.SortBy switch
            {
                SortBy.MostSuccessful => orgs.OrderByDescending(o => o.SuccessAppointmentCount),
                SortBy.Newest => orgs.OrderByDescending(o => o.CreatedDate),
                SortBy.Recommended => orgs.OrderByDescending(o => o.StarCount)
                    .ThenByDescending(o => o.SuccessAppointmentCount),
                _ => orgs.OrderByDescending(o => o.StarCount)
                    .ThenByDescending(o => o.SuccessAppointmentCount)
            };

            var orgList = sortedOrgs.ToList();

            // 3. ✅ صفحه‌بندی
            var totalCount = orgList.Count;
            var pagedOrgs = orgList
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            // 4. ✅ Mapping به DTO (بدون MinPrice)
            var items = pagedOrgs.Select(org => new OrgSearchResultDto
            {
                Id = org.Id,
                Name = org.Name,
                Image = org.Image,
                Description = org.Description,
                CityName = org.City?.Name ?? "نامشخص",
                OrgTypeName = org.Orgtype?.Name ?? "نامشخص",
                StarCount = org.StarCount,
                VoterCount = org.VoterCount,
                SuccessAppointmentCount = org.SuccessAppointmentCount,
                StartWorkTime = org.StartWorkTime.ToString("HH:mm"),
                EndWorkTime = org.EndWorkTime.ToString("HH:mm"),
                IsActive = org.IsActive,
                IsPremier = org.IsPremier,
                MinPrice = null // ❌ حذف شد
            }).ToList();

            return new SearchResultDto
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}