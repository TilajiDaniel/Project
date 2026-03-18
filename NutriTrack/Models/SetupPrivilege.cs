namespace NutriTrack.Models
{
    public partial class SetupPrivilege
    {
        public int Id { get; set; }
        public string SPrivilege { get; set; }

        public int Level { get; set; }

        public virtual ICollection<User> Users { get; set; } = new List<User>();

    }
}
