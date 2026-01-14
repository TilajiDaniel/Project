using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string? PasswordHash { get; set; }

    public string? Email { get; set; }

    public int? HeightCm { get; set; }

    public decimal? WeightKg { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();

    public virtual ICollection<WaterIntake> WaterIntakes { get; set; } = new List<WaterIntake>();
}
