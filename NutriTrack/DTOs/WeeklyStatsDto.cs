namespace NutriTrack.DTOs
{
    public class WeeklyStatsDto
    {
        public DateTime Date { get; set; }
        public int ConsumedCalories { get; set; }
        public int TargetCalories { get; set; }
        public int ConsumedWater { get; set; }
        public int TargetWater { get; set; }
    }


}
