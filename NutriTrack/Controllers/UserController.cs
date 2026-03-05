using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.DTOs;
using NutriTrack.Helpers;
using NutriTrack.Models;
using System.Security.Claims;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly TesztContext _context;

        public UserController(TesztContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "3")]
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new User() { UserId = -1, Username = $"Hiba történt: {ex.Message}" });
            }
        }

        [Authorize(Roles = "2,3")]
        [HttpGet("UserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
                if (user is null)
                    return BadRequest(new User() { UserId = -1, Username = "Nincs ilyen azonosítójú felhasználó" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new User() { UserId = -1, Username = $"Hiba történt: {ex.Message}" });
            }
        }

        [Authorize(Roles = "3")]
        [HttpPost("NewUser")]
        public async Task<IActionResult> AddNewUser([FromBody] RegistryDTO dto)
        {
            try
            {
                if (_context.Users.Any(u => u.Username == dto.Username))
                    return BadRequest("Felhasználónév már foglalt.");

                if (_context.Users.Any(u => u.Email == dto.Email))
                    return BadRequest("Email már regisztrálva.");

                var newUser = new User
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = PasswordHasher.HashPassword(dto.Password),
                    Privilege = 2,
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Felhasználó sikeresen létrehozva!",
                    user = new { newUser.UserId, newUser.Username, newUser.Email }
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }
        }

        [Authorize(Roles = "3")]
        [HttpPut("ModifyUsers")]
        public async Task<IActionResult> ModifyUser(User user)
        {
            try
            {
                if (!_context.Users.Any(u => u.UserId == user.UserId))
                    return BadRequest("Nincs ilyen felhasználó!");

                _context.Update(user);
                await _context.SaveChangesAsync();
                return Ok("Sikeres módosítás!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }
        }

        [Authorize(Roles = "3")]
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user is null)
                    return NotFound(new { message = "Nincs ilyen felhasználó!" });

                if (user.Privilege == 3)
                    return BadRequest(new { message = "Adminisztrátor nem törölhető!" });

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sikeres törlés!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "A felhasználó nem törölhető, mert adatok kapcsolódnak hozzá.", error = ex.Message });
            }
        }

        [Authorize(Roles = "2,3")]
        [HttpGet("my-goal")]
        public async Task<IActionResult> GetMyGoal()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var goal = await _context.WeightGoals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.StartDate)
                .FirstOrDefaultAsync();

            if (goal is null) return NotFound("Nincs még kitűzött cél.");

            return Ok(new { targetWeight = goal.TargetWeight });
        }
    }
}
