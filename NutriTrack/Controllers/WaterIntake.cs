using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;
using NutriTrack.DTOs;
using Microsoft.AspNetCore.Authorization; // Új
using System.Security.Claims; // Új

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <--- Csak bejelentkezett felhasználók használhatják
    public class WaterIntakeController : ControllerBase
    {
        public readonly NutriTrack.Models.TesztContext _context;

        public WaterIntakeController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }

        // Segédfüggvény az aktuális felhasználó ID-jának kinyeréséhez a JWT-ből
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("id")?.Value;

            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return 0;
        }

        // 1. Végpont: Lekérdezi a MAI napi összes ivást (A bejelentkezett usernek!)
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayWater()
        {
            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized("Érvénytelen felhasználó.");

            var today = DateTime.UtcNow.Date;

            // Csak a bejelentkezett felhasználó mai rekordjait összegezzük
            var totalWater = await _context.WaterIntakeLogs
                .Where(w => w.UserId == currentUserId && w.EntryDate.Date == today)
                .SumAsync(w => w.AmountMl);

            return Ok(new { amountMilliliters = totalWater });
        }

        // 2. Végpont: Új ivás rögzítése a bejelentkezett felhasználóhoz
        [HttpPost]
        public async Task<IActionResult> AddWater([FromBody] AddWaterDto dto)
        {
            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized("Érvénytelen felhasználó.");

            var waterLog = new WaterIntakeLog
            {
                UserId = currentUserId, // Dinamikus ID a fix 1 helyett
                AmountMl = dto.AmountMilliliters,
                EntryDate = dto.Date.Date,
                LoggedAt = DateTime.UtcNow // Érdemes beállítani a pontos időt is
            };

            _context.WaterIntakeLogs.Add(waterLog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Víz sikeresen rögzítve!", currentTotal = waterLog.AmountMl });
        }
    }
}