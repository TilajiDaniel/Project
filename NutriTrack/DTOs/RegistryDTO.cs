using Google.Protobuf.WellKnownTypes;

namespace NutriTrack.DTOs
{
    public class RegistryDTO
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public int Privilege { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
