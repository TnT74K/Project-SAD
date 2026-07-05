
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class AppointmentStatus
{
    public int Id { get; set; }

    public string Status { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}