using Google.Protobuf.WellKnownTypes;

namespace NutriTrack.DTOs
{
    public class LoginDTO
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
