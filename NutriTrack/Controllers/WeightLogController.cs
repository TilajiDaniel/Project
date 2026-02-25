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
}