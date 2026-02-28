using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NutriTrack.DTOs;
using NutriTrack.DTOs.NutriTrack.DTOs;
using NutriTrack.Helpers;
using NutriTrack.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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

            string roleName = user.Privilege == 1 ? "User" : "Admin";

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
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

        [Authorize]
        [HttpPost("complete-setup")]
        public async Task<IActionResult> CompleteSetup([FromBody] FirstSetupDto dto)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Felhasználó nem található");

            user.HeightCm = (int)dto.Height;
            user.WeightKg = (decimal)dto.CurrentWeight;

            var targetGoal = new WeightGoal
            {
                UserId = userId,
                TargetWeight = (decimal)dto.TargetWeight,
                StartDate = DateTime.UtcNow
            };

            _context.WeightGoals.Add(targetGoal);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Minden adat sikeresen mentve!" });
        }

        [Authorize]
        [HttpPost("save-daily-goals")]
        public async Task<IActionResult> SaveDailyGoals([FromBody] SaveSettingsDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            // Megnézzük, van-e már beállítása a usernek
            var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new UserSetting { UserId = userId };
                _context.UserSettings.Add(settings);
            }

            settings.DailyCalorieGoal = dto.DailyCalories;
            // Ide a napi viznek kerul majd a beállítása

            await _context.SaveChangesAsync();
            return Ok(new { message = "Célok sikeresen mentve!" });
        }

        [HttpGet("weekly-stats")]
        public async Task<ActionResult<IEnumerable<WeeklyStatsDto>>> GetWeeklyStats()
        {
            // 1. Felhasználó azonosítása
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var endDate = DateTime.Today;
            var startDate = endDate.AddDays(-6);

            // 2. Felhasználói célok lekérése (user_settings tábla)
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId);

            int calorieGoal = settings?.DailyCalorieGoal ?? 2000;
            int waterGoal = settings?.DailyWaterGoalMl ?? 2500;

            // 3. Kalória összesítés (meals + meal_food_items + food_items)
            var consumedCalories = await _context.Meals
                .Where(m => m.UserId == userId && m.MealDate >= startDate && m.MealDate <= endDate)
                .SelectMany(m => m.MealFoodItems)
                .GroupBy(mfi => mfi.Meal.MealDate)
                .Select(g => new
                {
                    Date = g.Key,
                    // Gramm / 100 * Kalória per 100g
                    TotalCalories = g.Sum(mfi => (mfi.QuantityGrams / 100.0) * mfi.Food.CaloriesPer100g)
                })
                .ToListAsync();

            // 4. Vízfogyasztás összesítés (water_intake_log tábla)
            var consumedWater = await _context.WaterIntakeLogs
                .Where(w => w.UserId == userId && w.EntryDate >= startDate && w.EntryDate <= endDate)
                .GroupBy(w => w.EntryDate)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalWater = g.Sum(w => w.AmountMl)
                })
                .ToListAsync();

            // 5. Adatok egyesítése a heti struktúrába
            var result = new List<WeeklyStatsDto>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayCalories = consumedCalories.FirstOrDefault(c => c.Date == date);
                var dayWater = consumedWater.FirstOrDefault(w => w.Date == date);

                result.Add(new WeeklyStatsDto
                {
                    Date = date,
                    TargetCalories = calorieGoal,
                    ConsumedCalories = (int)(dayCalories?.TotalCalories ?? 0),
                    TargetWater = waterGoal,
                    ConsumedWater = dayWater?.TotalWater ?? 0
                });
            }

            return Ok(result.OrderBy(r => r.Date));
        }
    }
}
