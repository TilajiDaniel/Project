using System;
using System.Collections.Generic;

namespace NutritrackAPI.Models;

public partial class FoodItem
{
    public int FoodId { get; set; }

    public string? Name { get; set; }

    public int? CaloriesPer100g { get; set; }

    public decimal? ProteinPer100g { get; set; }

    public decimal? CarbsPer100g { get; set; }

    public decimal? FatPer100g { get; set; }

    public int? CategoryId { get; set; }

    public virtual Category? Category { get; set; }
}
