using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;
using System.Security.Claims;

namespace NutriTrack.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("api/[controller]")]
    public class WeightController : ControllerBase
    {
        private readonly TesztContext _context;

        public WeightController(TesztContext context)
        {
            _context = context;
        }

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

        public class WeightRequest
        {
            public double Weight { get; set; }
        }

        [Authorize(Roles = "2,3")]
        [HttpPost]
        public async Task<IActionResult> LogWeight([FromBody] WeightRequest request)
        {
            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized("Érvénytelen felhasználó.");

            var today = DateTime.UtcNow.Date;
            var existingLog = await _context.WeightLogs
                .FirstOrDefaultAsync(w => w.UserId == currentUserId && w.MeasurementDate.Date == today);

            if (existingLog != null)
            {
                existingLog.WeightKg = (decimal)request.Weight;
            }
            else
            {
                _context.WeightLogs.Add(new WeightLog
                {
                    UserId = currentUserId,
                    WeightKg = (decimal)request.Weight,
                    MeasurementDate = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Súly elmentve!" });
        }

        [Authorize(Roles = "2,3")]
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayWeight()
        {
            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0) return Unauthorized("Érvénytelen felhasználó.");

            var today = DateTime.UtcNow.Date;

            var totalWeight = await _context.WeightLogs
                .Where(w => w.UserId == currentUserId && w.MeasurementDate.Date == today)
                .SumAsync(w => w.WeightKg);

            return Ok(new { weight = totalWeight });
        }
    }
}