
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class Orgservice
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int TimeDuration { get; set; }

    public int OrgId { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}