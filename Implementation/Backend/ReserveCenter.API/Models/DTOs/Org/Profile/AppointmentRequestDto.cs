namespace ReserveCenter.API.Models.DTOs.PublicOrgProfile;

public class AppointmentRequestDto
{
    public int OrgId { get; set; }

    public int ServiceId { get; set; }

    public int UserId { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }
}