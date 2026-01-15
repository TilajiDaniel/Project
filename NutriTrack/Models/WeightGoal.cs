using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class WeightGoal
{
    public int GoalId { get; set; }

    public int UserId { get; set; }

    public decimal TargetWeight { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
