using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Models.DTOs.Search;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        private readonly ILogger<SearchController> _logger;

        public SearchController(ISearchService searchService, ILogger<SearchController> logger)
        {
            _searchService = searchService;
            _logger = logger;
        }

        /// <summary>
        /// جستجوی پیشرفته سازمان‌ها
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] SearchRequest request)
        {
            try
            {
                var result = await _searchService.SearchAsync(request);
                return Ok(new { IsSuccess = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در جستجو");
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}