
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string PhoneNumber { get; set; }

    public string Password { get; set; }

    public string LastPassword { get; set; }

    public DateTime? ChangePasswordDateTime { get; set; }

    public int? CityId { get; set; }

    public string NationalCode { get; set; }

    public string ProfileImage { get; set; }

    public int WrongPasswordCount { get; set; }

    public DateTime? NextTimeToLogin { get; set; }

    public bool IsBlocked { get; set; }

    public bool IsDeleted { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<Advertisement> Advertisements { get; set; } = new List<Advertisement>();

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual City City { get; set; }

    public virtual ICollection<User> InverseModifiedByNavigation { get; set; } = new List<User>();

    public virtual User ModifiedByNavigation { get; set; }

    public virtual ICollection<Org> Orgs { get; set; } = new List<Org>();

    public virtual ICollection<StaffList> StaffLists { get; set; } = new List<StaffList>();

    public virtual ICollection<UnregisteredOrg> UnregisteredOrgs { get; set; } = new List<UnregisteredOrg>();
}