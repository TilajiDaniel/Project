using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    public class MealWithFoodsDto
    {
        public int Id { get; set; } 
        public string MealType { get; set; } = string.Empty;
        public double TotalCalories { get; set; }
        public double TotalProtein { get; set; }
        public List<FoodItemDto> FoodItems { get; set; } = new();
    }


}
