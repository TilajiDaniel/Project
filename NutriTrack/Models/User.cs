using Google.Protobuf.WellKnownTypes;
using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? HeightCm { get; set; }

    public decimal? WeightKg { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? Privilege { get; set; }

    public virtual ICollection<Meal>? Meals { get; set; } = new List<Meal>();

    public virtual Privilege? PrivilegeNavigation { get; set; }

    public virtual UserSetting? UserSetting { get; set; }

    public virtual ICollection<WaterIntakeLog>? WaterIntakeLogs { get; set; } = new List<WaterIntakeLog>();

    public virtual ICollection<WeightGoal>? WeightGoals { get; set; } = new List<WeightGoal>();

    public virtual ICollection<WeightLog>? WeightLogs { get; set; } = new List<WeightLog>();
}
