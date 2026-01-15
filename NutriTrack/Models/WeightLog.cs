using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class WeightLog
{
    public int WeightEntryId { get; set; }

    public int UserId { get; set; }

    public decimal WeightKg { get; set; }

    public DateTime MeasurementDate { get; set; }

    public DateTime MeasuredAt { get; set; }

    public virtual User User { get; set; } = null!;
}
