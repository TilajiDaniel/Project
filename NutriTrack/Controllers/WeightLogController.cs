using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WeightController : ControllerBase
{
    private readonly TesztContext _context;
    public WeightController(TesztContext context) { _context = context; }
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
    [HttpPost]
    public async Task<IActionResult> LogWeight([FromBody] double weight)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        // Megnézzük, van-e már mára bejegyzés
        var today = DateTime.UtcNow.Date;
        var existingLog = await _context.WeightLogs
            .FirstOrDefaultAsync(w => w.UserId == userId && w.MeasuredAt.Date == today);

        if (existingLog != null)
        {
            existingLog.WeightKg = (decimal)weight; // Ha már mérlegelt ma, frissítjük
        }
        else
        {
            _context.WeightLogs.Add(new WeightLog
            {
                UserId = userId,
                WeightKg = (decimal)weight,
                MeasurementDate = DateTime.UtcNow
            });
        }


        await _context.SaveChangesAsync();
        return Ok(new { message = "Súly elmentve!" });
    }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayWeight()
        {
            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized("Érvénytelen felhasználó.");

            var today = DateTime.UtcNow.Date;

            // Csak a bejelentkezett felhasználó mai rekordjait összegezzük
            var totalWeight = await _context.WeightLogs
                .Where(w => w.UserId == currentUserId && w.MeasurementDate.Date == today)
                .SumAsync(w => w.WeightKg);

            return Ok(new { weight = totalWeight });
        }
    
}