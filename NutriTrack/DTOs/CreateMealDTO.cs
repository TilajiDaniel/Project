using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    public class CreateMealDto
    {

        public int UserId { get; set; }
        public DateTime MealDate { get; set; }

        public string MealType { get; set; }

        public List<MealFoodItemDto> FoodItems { get; set; } = new();
    }

    
}
