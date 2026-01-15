using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class WaterIntakeLog
{
    public int EntryId { get; set; }

    public int UserId { get; set; }

    public DateTime EntryDate { get; set; }

    public int AmountMl { get; set; }

    public DateTime LoggedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
