using System;
using System.Collections.Generic;

namespace NutriTrack.Models;

public partial class FoodItem
{
    public int FoodId { get; set; }

    public string Name { get; set; } = null!;

    public int CategoryId { get; set; }

    public int CaloriesPer100g { get; set; }

    public decimal ProteinPer100g { get; set; }

    public decimal CarbsPer100g { get; set; }

    public decimal FatPer100g { get; set; }

    public virtual FoodCategory Category { get; set; } = null!;

    public virtual ICollection<MealFoodItem> MealFoodItems { get; set; } = new List<MealFoodItem>();
}
