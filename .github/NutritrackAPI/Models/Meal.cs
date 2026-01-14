using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class Meal
{
    public int MealId { get; set; }

    public int? UserId { get; set; }

    public DateTime? Date { get; set; }

    public string? MealType { get; set; }

    public virtual User? User { get; set; }
}
