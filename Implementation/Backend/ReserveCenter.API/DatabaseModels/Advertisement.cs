
#nullable disable
using System;
using System.Collections.Generic;

namespace ReserveCenter.API.DatabaseModels;

public partial class Advertisement
{
    public int Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string Image { get; set; }

    public int OrgId { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual User CreatedByNavigation { get; set; }

    public virtual Org Org { get; set; }
}