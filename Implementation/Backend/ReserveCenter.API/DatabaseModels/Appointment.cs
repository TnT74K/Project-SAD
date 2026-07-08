
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class Appointment
{
    public int Id { get; set; }

    public int Orgid { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly AppointmentTime { get; set; }

    public int Price { get; set; }

    public int OrgserviceId { get; set; }

    public int? BookingUserId { get; set; }

    public string BookingConfirmCode { get; set; }

    public bool IsReserved { get; set; }

    public int? AppointmentStatusId { get; set; }

    public virtual AppointmentStatus AppointmentStatus { get; set; }

    public virtual User BookingUser { get; set; }

    public virtual Org Org { get; set; }

    public virtual Orgservice Orgservice { get; set; }
}