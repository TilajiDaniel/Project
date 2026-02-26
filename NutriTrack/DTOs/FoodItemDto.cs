using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    public class FoodItemDto
    {
        public int Id { get; set; }  
        public string FoodName { get; set; } = string.Empty;
        public double QuantityGrams { get; set; }
        public int Calories { get; set; }
        public double Protein { get; set; }
    }


}
