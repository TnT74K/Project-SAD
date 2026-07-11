namespace ReserveCenter.API.Models.DTOs.Search
{
    public class SearchResultDto
    {
        public List<OrgSearchResultDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

public class OrgSearchResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string CityName { get; set; }
        public string OrgTypeName { get; set; }
        public decimal StarCount { get; set; }
        public int VoterCount { get; set; }
        public int SuccessAppointmentCount { get; set; }
        public string StartWorkTime { get; set; }
        public string EndWorkTime { get; set; }
        public bool IsActive { get; set; }
        public bool IsPremier { get; set; }
    }
}