
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class City
{
    public int Id { get; set; }

    public string Name { get; set; }

    public virtual ICollection<Org> Orgs { get; set; } = new List<Org>();

    public virtual ICollection<UnregisteredOrg> UnregisteredOrgs { get; set; } = new List<UnregisteredOrg>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}