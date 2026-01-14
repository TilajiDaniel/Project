using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class Goal
{
    public int GoalId { get; set; }

    public int? UserId { get; set; }

    public decimal? TargetWeight { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual User? User { get; set; }
}
