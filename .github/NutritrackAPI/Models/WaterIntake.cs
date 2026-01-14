using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class WaterIntake
{
    public int EntryId { get; set; }

    public int? UserId { get; set; }

    public DateTime? Date { get; set; }

    public int? AmountMl { get; set; }

    public virtual User? User { get; set; }
}
