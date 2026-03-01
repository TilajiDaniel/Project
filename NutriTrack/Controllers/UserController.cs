using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;
using System.Security.Claims;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly NutriTrack.Models.TesztContext _context;
        public UserController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetAllUsers()
        {

            try
            {
                List<User> Users = await _context.Users.ToListAsync();

                return Ok(Users);

            }
            catch (Exception ex)
            {
                return BadRequest(new User()
                {
                    UserId = -1,
                    Username = $"Hiba történt: {ex.Message}",


                });
            }


        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "Nincs ilyen felhasználó!" });
                }

                if (user.Privilege == 3)
                {
                    return BadRequest(new { message = "Adminisztrátor nem törölhető!" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sikeres törlés!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "A felhasználó nem törölhető, mert adatok kapcsolódnak hozzá (pl. ételek, napló).", error = ex.Message });
            }
        }



        [HttpGet("UserById/{Id}")]
        public async Task<IActionResult> GetUserById(int Id)
        {

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(f => f.UserId == Id);
                if (user is User)
                {
                    return Ok(user);
                }
                else
                {
                    return BadRequest(new User()
                    {
                        UserId = -1,
                        Username = $"Hiba történt: Nincs ilyen azonosítójú felhasználó",

                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new User()
                {
                    UserId = -1,
                    Username = $"Hiba történt: {ex.Message}",

                });
            }

        }


        [HttpPost("NewUser")]
        public IActionResult AddNewUser(User user)
        {

            try
            {


                _context.Add(user);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }



        [HttpPut("ModifyUsers")]
        public IActionResult ModifyUser(User user)
        {

            try
            {
                if (_context.Users.Contains(user))
                {
                    _context.Update(user);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen felhasználó!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }

        }



        [Authorize]
        [HttpGet("my-goal")]
        public async Task<IActionResult> GetMyGoal()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Megkeressük a legfrissebb célsúlyt a felhasználóhoz
            var goal = await _context.WeightGoals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.StartDate)
                .FirstOrDefaultAsync();

            if (goal == null) return NotFound("Nincs még kitűzött cél.");

            return Ok(new { targetWeight = goal.TargetWeight });
        }
    }
}
