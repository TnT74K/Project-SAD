namespace ReserveCenter.API.Models.DTOs.Org.Service
{
    public class ServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TimeDuration { get; set; }  // مدت زمان به دقیقه
        public int OrgId { get; set; }
        public string OrgName { get; set; }    // برای نمایش
    }
}