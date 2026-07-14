
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class Org
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Image { get; set; }

    public string Description { get; set; }

    public DateOnly EstablishmentDate { get; set; }

    public int OrgtypeId { get; set; }

    public string ActiveDaysPerWeek { get; set; }

    public TimeOnly StartWorkTime { get; set; }

    public TimeOnly EndWorkTime { get; set; }

    public TimeOnly StartRestTime { get; set; }

    public TimeOnly EndRestTime { get; set; }

    public int CityId { get; set; }

    public string Address { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public bool IsPremier { get; set; }

    public int SuccessAppointmentCount { get; set; }

    public decimal StarCount { get; set; }

    public int VoterCount { get; set; }

    public bool IsActive { get; set; }

    public bool IsBanned { get; set; }

    public bool IsDeleted { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<Advertisement> Advertisements { get; set; } = new List<Advertisement>();

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual City City { get; set; }

    public virtual User CreatedByNavigation { get; set; }

    public virtual Orgtype Orgtype { get; set; }

    public virtual ICollection<StaffList> StaffLists { get; set; } = new List<StaffList>();
}