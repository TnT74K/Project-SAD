
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class StaffList
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int RoleId { get; set; }

    public int OrgId { get; set; }

    public bool IsActive { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual Org Org { get; set; }

    public virtual Role Role { get; set; }

    public virtual User User { get; set; }
}