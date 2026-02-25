using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    
    public class MealFoodItemDto
    {

        public int FoodId { get; set; }

        public int QuantityGrams { get; set; }
    }
}
