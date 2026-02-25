using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class Meal
{
    public int MealId { get; set; }

    public int UserId { get; set; }

    public DateTime MealDate { get; set; }

    public string MealType { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<MealFoodItem> MealFoodItems { get; set; } = new List<MealFoodItem>();

    public virtual User User { get; set; } = null!;
}
