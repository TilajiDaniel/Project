using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class MealFoodItem
{
    public int MealId { get; set; }

    public int FoodId { get; set; }

    public int? QuantityGrams { get; set; }

    public DateTime? AddedAt { get; set; }

    public virtual FoodItem Food { get; set; } = null!;

    public virtual Meal Meal { get; set; } = null!;
}
