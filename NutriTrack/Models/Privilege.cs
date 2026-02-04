using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class Privilege
{
    public int Id { get; set; }

    public string? Privilege1 { get; set; }

    public int? Level { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
