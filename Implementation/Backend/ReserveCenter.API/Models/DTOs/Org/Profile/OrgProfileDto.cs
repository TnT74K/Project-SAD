namespace ReserveCenter.API.Models.DTOs.Org.Profile
{
    public class OrgProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public DateOnly EstablishmentDate { get; set; }
        public string OrgTypeName { get; set; }
        public string ActiveDaysPerWeek { get; set; }
        public TimeOnly StartWorkTime { get; set; }
        public TimeOnly EndWorkTime { get; set; }
        public TimeOnly? StartRestTime { get; set; }
        public TimeOnly? EndRestTime { get; set; }
        public string CityName { get; set; }
        public string Address { get; set; }
        public bool IsPremier { get; set; }
        public int SuccessAppointmentCount { get; set; }
        public decimal StarCount { get; set; }
        public bool IsActive { get; set; }
        public bool IsBanned { get; set; }
    }
}