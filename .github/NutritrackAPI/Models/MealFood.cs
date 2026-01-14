using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class MealFood
{
    public int? MealId { get; set; }

    public int? FoodId { get; set; }

    public int? QuantityGrams { get; set; }

    public virtual FoodItem? Food { get; set; }

    public virtual Meal? Meal { get; set; }
}
