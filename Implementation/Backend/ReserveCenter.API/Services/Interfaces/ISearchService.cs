using ReserveCenter.API.Models.DTOs.Search;

namespace ReserveCenter.API.Services.Interfaces
{
    public interface ISearchService
    {
        /// <summary>
        /// جستجوی پیشرفته سازمان‌ها با فیلترها، مرتب‌سازی و صفحه‌بندی
        /// </summary>
        Task<SearchResultDto> SearchAsync(SearchRequest request);
    }
}