using Microsoft.AspNetCore.Mvc;

namespace NutriTrack.Models
{
    public partial class Privilages 
    {
        public int Id { get; set; }
        public string Privilege { get; set; } = null!;
        public string Level { get; set; } = null!;

        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
