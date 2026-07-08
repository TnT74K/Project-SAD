namespace ReserveCenter.API.Models.DTOs.PublicOrgProfile;

public class AppointmentResultDto
{
    public int AppointmentId { get; set; }

    public string TrackingCode { get; set; } = "";

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public int AppointmentStatusId { get; set; }
}