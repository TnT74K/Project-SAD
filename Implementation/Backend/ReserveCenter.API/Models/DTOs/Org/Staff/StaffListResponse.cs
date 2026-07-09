namespace ReserveCenter.API.Models.DTOs.Org.Staff
{
    public class StaffListResponse
    {
        public int TotalCount { get; set; }            // تعداد کل کارکنان
        public List<StaffDto> StaffList { get; set; }  // لیست کارکنان
    }
}