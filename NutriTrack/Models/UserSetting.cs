using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class UserSetting
{
    public int UserId { get; set; }

    public int? DailyCalorieGoal { get; set; }

    public int? DailyWaterGoalMl { get; set; }

    public string? PreferredTimezone { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
