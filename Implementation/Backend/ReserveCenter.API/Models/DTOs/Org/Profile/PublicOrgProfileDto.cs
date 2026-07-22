namespace ReserveCenter.API.Models.DTOs.PublicOrgProfile;

public class PublicOrgProfileDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public string Address { get; set; } = "";

    public string Image { get; set; } = "";

    public decimal StarCount { get; set; }

    public int VoterCount { get; set; }

    public int SuccessAppointmentCount { get; set; }

    public bool IsPremier { get; set; }

    public bool IsActive { get; set; }

    public string StartWorkTime { get; set; } = "";

    public string EndWorkTime { get; set; } = "";

    public List<PublicServiceDto> Services { get; set; } = new();
}
