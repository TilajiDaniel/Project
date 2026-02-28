using System.ComponentModel.DataAnnotations;
namespace NutriTrack.DTOs
{
    public class FirstSetupDto
    {

        public double Height { get; set; }
        public double CurrentWeight { get; set; }
        public double TargetWeight { get; set; }
    }
}
