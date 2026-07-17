
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class Role
{
    public int Id { get; set; }

    public string Name { get; set; }

    public virtual ICollection<StaffList> StaffLists { get; set; } = new List<StaffList>();
}
/*
Roles:
Customer is represented by null and does not have a role record.
*/
