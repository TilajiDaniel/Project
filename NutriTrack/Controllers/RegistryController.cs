using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using NutriTrack.Models;
using NutriTrack.DTOs;
using NutriTrack.Helpers;
using NutriTrack.DTOs.NutriTrack.DTOs;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistryController : ControllerBase
    {
        private readonly TesztContext _context;
        private readonly IConfiguration _configuration;

        public RegistryController(TesztContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryDTO dto)
        {
            try
            {
                // Duplikáció ellenőrzés
                if (_context.Users.Any(u => u.Username == dto.Username))
                    return BadRequest("Felhasználónév már foglalt.");

                if (_context.Users.Any(u => u.Email == dto.Email))
                    return BadRequest("Email már regisztrálva.");

                // User létrehozása
                User newUser = new User
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = PasswordHasher.HashPassword(dto.Password), // ← Hashelés itt!
                    Privilege = 1,
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                // JWT Token generálás
                var token = GenerateJwtToken(newUser);

                return Ok(new
                {
                    message = "Sikeres regisztráció!",
                    token = token,
                    user = new { newUser.UserId, newUser.Username, newUser.Email }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == dto.Username);

                if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                {
                    return Unauthorized("Hibás felhasználónév vagy jelszó!");
                }

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    token = token,
                    user = new { user.UserId, user.Username, user.Email, user.Privilege }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Privilege.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
