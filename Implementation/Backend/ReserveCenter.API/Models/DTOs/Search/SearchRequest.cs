using ReserveCenter.API.Models.Enums;

namespace ReserveCenter.API.Models.DTOs.Search
{
    public class SearchRequest
    {
        // جستجوی متنی
        public string? Query { get; set; }

        // فیلترها
        public CityEnum City { get; set; } = CityEnum.All;
        public OrgTypeEnum OrgType { get; set; } = OrgTypeEnum.All;
        public bool UpFourStar { get; set; } = false;      // امتیاز >= 4
        public bool Up500Appointment { get; set; } = false; // نوبت موفق >= 500
        public bool HasAppointment { get; set; } = false;   // نوبت موجود

        // مرتب‌سازی
        public SortBy SortBy { get; set; } = SortBy.Recommended;

        // صفحه‌بندی
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public enum SortBy
    {
        Recommended = 0,        // پیشنهادی (بر اساس امتیاز و تعداد نوبت)
        MostSuccessful = 1,     // بیشترین نوبت موفق
        Newest = 2              // جدیدترین
    }
}