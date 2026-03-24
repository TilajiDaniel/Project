using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NutriTrack.DTOs;
using NutriTrack.Helpers;
using NutriTrack.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistryController : ControllerBase
    {
        private readonly TesztContext _context;
        private readonly Jwtsettings _jwtSettings;
        private readonly IConfiguration _configuration;

        public RegistryController(TesztContext context, Jwtsettings jwtSettings, IConfiguration configuration)
        {
            _context = context;
            _jwtSettings = jwtSettings;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryDTO dto)
        {
            try
            {
                if (_context.Users.Any(u => u.Username == dto.Username))
                    return BadRequest("Felhasználónév már foglalt.");

                if (_context.Users.Any(u => u.Email == dto.Email))
                    return BadRequest("Email már regisztrálva.");

                var verificationToken = Guid.NewGuid().ToString("N");

                var newUser = new User
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = PasswordHasher.HashPassword(dto.Password),
                    Privilege = 1,
                    CreatedAt = DateTime.Now,
                    EmailVerificationToken = verificationToken,
                    VerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                var baseUrl = _configuration["EmailSettings:AppBaseUrl"] ?? "https://localhost:7133";
                var verifyLink = $"{baseUrl}/api/Registry/verify-email?token={verificationToken}";

                await SendEmail(
                    dto.Email,
                    "NutriTrack - Erősítsd meg az email-címed!",
                    $"""
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;">
                        <div style="background:#2C3E50;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
                            <h1 style="color:white;margin:0;font-size:26px;">NutriTrack</h1>
                        </div>
                        <div style="background:white;padding:36px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
                            <h2 style="color:#2C3E50;margin-top:0;">Email-cím megerősítése</h2>
                            <p style="color:#555;">Kedves <strong>{dto.Username}</strong>!</p>
                            <p style="color:#555;">Köszönjük a regisztrációt! A fiókod aktiválásához kattints az alábbi gombra:</p>
                            <div style="text-align:center;margin:32px 0;">
                                <a href="{verifyLink}"
                                   style="background:#27AE60;color:white;padding:14px 32px;
                                          text-decoration:none;border-radius:6px;font-size:16px;
                                          font-weight:bold;display:inline-block;">
                                    Email megerősítése
                                </a>
                            </div>
                            <p style="color:#888;font-size:13px;">
                                A gomb 24 óráig érvényes.<br/>
                                Ha nem te regisztráltál, hagyhatod figyelmen kívül ezt az emailt.
                            </p>
                            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
                            <p style="color:#aaa;font-size:12px;">
                                Ha a gomb nem működik, másold be ezt a linket a böngészőbe:<br/>
                                <a href="{verifyLink}" style="color:#3498DB;word-break:break-all;">{verifyLink}</a>
                            </p>
                        </div>
                    </div>
                    """
                );

                return Ok(new
                {
                    message = "Sikeres regisztráció! Ellenőrizd az email fiókodat a megerősítő linkért.",
                    user = new { newUser.UserId, newUser.Username, newUser.Email }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba: {ex.Message}");
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

            if (user == null)
                return BadRequest("Érvénytelen vagy már felhasznált token!");

            if (user.VerificationTokenExpiry < DateTime.UtcNow)
                return BadRequest("A link lejárt! Kérj új megerősítő emailt a /resend-verification végponton.");

            if (user.Privilege > 1)
                return Ok(new { message = "Az email-cím már meg van erősítve!" });

            user.Privilege = 2;
            user.EmailVerificationToken = null;
            user.VerificationTokenExpiry = null;
            await _context.SaveChangesAsync();

            var frontendUrl = _configuration["EmailSettings:FrontendBaseUrl"] ?? "http://localhost:5173";
            return Redirect($"{frontendUrl}/login");
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] LoginDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Username || u.Username == dto.Username);

            if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized("Hibás adatok!");

            if (user.Privilege > 1)
                return BadRequest("Ez az email-cím már meg van erősítve!");

            var newToken = Guid.NewGuid().ToString("N");
            user.EmailVerificationToken = newToken;
            user.VerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            await _context.SaveChangesAsync();

            var baseUrl = _configuration["EmailSettings:AppBaseUrl"] ?? "https://localhost:7133";
            var verifyLink = $"{baseUrl}/api/Registry/verify-email?token={newToken}";

            await SendEmail(
                user.Email,
                "NutriTrack - Új megerősítő link",
                $"""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;">
                    <div style="background:#2C3E50;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
                        <h1 style="color:white;margin:0;font-size:26px;">NutriTrack</h1>
                    </div>
                    <div style="background:white;padding:36px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
                        <h2 style="color:#2C3E50;margin-top:0;">Email-cím megerősítése</h2>
                        <p style="color:#555;">Kedves <strong>{user.Username}</strong>!</p>
                        <p style="color:#555;">Új megerősítő linket igényeltél. Kattints az alábbi gombra:</p>
                        <div style="text-align:center;margin:32px 0;">
                            <a href="{verifyLink}"
                               style="background:#27AE60;color:white;padding:14px 32px;
                                      text-decoration:none;border-radius:6px;font-size:16px;
                                      font-weight:bold;display:inline-block;">
                                Email megerősítése
                            </a>
                        </div>
                        <p style="color:#888;font-size:13px;">
                            A gomb 24 óráig érvényes.<br/>
                            Ha nem te kérted ezt, hagyhatod figyelmen kívül.
                        </p>
                        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
                        <p style="color:#aaa;font-size:12px;">
                            Ha a gomb nem működik, másold be ezt a linket a böngészőbe:<br/>
                            <a href="{verifyLink}" style="color:#3498DB;word-break:break-all;">{verifyLink}</a>
                        </p>
                    </div>
                </div>
                """
            );

            return Ok(new { message = "Megerősítő email újra elküldve!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

                if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                    return Unauthorized("Hibás felhasználónév vagy jelszó!");

                if (user.Privilege == 1)
                    return Unauthorized("Az email-cím nincs megerősítve! Ellenőrizd az emailjeidet.");

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    token,
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
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Privilege.ToString() ?? "1")
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //prior 1
        [Authorize(Roles = "2,3")]
        [HttpPost("complete-setup")]
        public async Task<IActionResult> CompleteSetup([FromBody] FirstSetupDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Felhasználó nem található");

            user.HeightCm = (int)dto.Height;
            user.WeightKg = (decimal)dto.CurrentWeight;

            _context.WeightGoals.Add(new WeightGoal
            {
                UserId = userId,
                TargetWeight = (decimal)dto.TargetWeight,
                StartDate = DateTime.UtcNow
            });

            user.Setup_completion = 1;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Minden adat sikeresen mentve!" });
        }

        //prior 2
        [Authorize(Roles = "2,3")]
        [HttpPost("save-daily-goals")]
        public async Task<IActionResult> SaveDailyGoals([FromBody] SaveSettingsDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new UserSetting { UserId = userId };
                _context.UserSettings.Add(settings);
            }

            settings.DailyCalorieGoal = dto.DailyCalories;
            settings.DailyWaterGoalMl = dto.DailyWater;

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
                user.Setup_completion = 2;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Célok sikeresen mentve!" });
        }
        //prior 3
        [Authorize(Roles = "2,3")]
        [HttpPut("BefejezesGomb")]
        public async Task<IActionResult> Befejezes()
        {
            try
            {
                var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return Unauthorized("Érvénytelen token vagy azonosító.");
                }

                var userInDb = await _context.Users.FindAsync(userId);

                if (userInDb == null)
                {
                    return NotFound("A felhasználó nem található az adatbázisban.");
                }

                userInDb.Setup_completion = 3;

                _context.Users.Update(userInDb);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "A beállítási folyamat sikeresen lezárult!",
                    currentStatus = userInDb.Setup_completion
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Szerver hiba történt: {ex.Message}");
            }
        }
        [Authorize(Roles = "2,3")]
        [HttpGet("get-setup-status")]
        public async Task<IActionResult> GetSetupStatus()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            return Ok(new { setupCompletion = user.Setup_completion });
        }
        [Authorize(Roles = "2,3")]
        [HttpGet("weekly-stats")]
        public async Task<ActionResult<IEnumerable<WeeklyStatsDto>>> GetWeeklyStats()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var endDate = DateTime.Today;
            var startDate = endDate.AddDays(-6);

            var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
            int calorieGoal = settings?.DailyCalorieGoal ?? 2000;
            int waterGoal = settings?.DailyWaterGoalMl ?? 2500;

            var consumedCalories = await _context.Meals
                .Where(m => m.UserId == userId && m.MealDate >= startDate && m.MealDate <= endDate)
                .SelectMany(m => m.MealFoodItems)
                .GroupBy(mfi => mfi.Meal.MealDate)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(mfi => (mfi.QuantityGrams / 100.0) * mfi.Food.CaloriesPer100g)
                })
                .ToListAsync();

            var consumedWater = await _context.WaterIntakeLogs
                .Where(w => w.UserId == userId && w.EntryDate >= startDate && w.EntryDate <= endDate)
                .GroupBy(w => w.EntryDate)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalWater = g.Sum(w => w.AmountMl)
                })
                .ToListAsync();

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

        private async Task SendEmail(string mailAddressTo, string subject, string body)
        {
            var host = _configuration["EmailSettings:Host"] ?? "smtp.gmail.com";
            var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
            var fromAddress = _configuration["EmailSettings:FromAddress"] ?? string.Empty;
            var appPassword = _configuration["EmailSettings:AppPassword"] ?? string.Empty;

            using var mail = new MailMessage();
            mail.From = new MailAddress(fromAddress, "NutriTrack");
            mail.To.Add(mailAddressTo);
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = true;

            using var smtp = new SmtpClient(host, port);
            smtp.Credentials = new NetworkCredential(fromAddress, appPassword);
            smtp.EnableSsl = true;

            await smtp.SendMailAsync(mail);
        }
    }
}
