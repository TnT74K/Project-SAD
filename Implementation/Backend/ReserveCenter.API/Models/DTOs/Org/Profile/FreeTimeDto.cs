namespace ReserveCenter.API.Models.DTOs.PublicOrgProfile;

public class FreeTimeDto
{
    public TimeOnly StartTime { get; set; }
    public DateOnly Date { get; set; }
    public int Price { get; set; }
}