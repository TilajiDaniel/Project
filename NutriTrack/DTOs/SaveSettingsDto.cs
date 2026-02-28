using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    public class SaveSettingsDto
    {
        public int DailyCalories { get; set; }
        public int DailyWater { get; set; } // Opcionális, ha később akarod
    }
}
