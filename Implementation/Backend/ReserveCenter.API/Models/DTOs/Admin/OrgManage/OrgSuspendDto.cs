namespace ReserveCenter.API.Models.DTOs.Admin.OrgManage;

public class OrgSuspendDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string OrgType { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public bool IsBanned { get; set; }
}