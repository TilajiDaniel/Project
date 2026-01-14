using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritrackAPI.Models;

namespace NutritrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        public readonly NutritrackAPI.Models.NutritrackContext _context;
        public GoalController(NutritrackAPI.Models.NutritrackContext context)
        {
            _context = context;
        }


        [HttpGet("GetAllGoals")]
        public async Task<IActionResult> GetAllGoals()
        {
            try
            {
                var goals = await _context.Goals.ToListAsync();
                return Ok(goals);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message  });
            }
        }

        [HttpGet("GetGoalById/{id}")]
        public async Task<IActionResult> GetGoalById(int id)
        {
            try
            {
                var goal = await _context.Goals.FirstOrDefaultAsync(g => g.GoalId == id);
                if (goal is Goal)
                {
                    return Ok(goal);
                }
                else
                {
                    return NotFound(new { message = "Nem található ilyen azonosítójú cél." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("CreateGoal")]
        public IActionResult CreateGoal([FromBody] Goal goal)
        {
            try
            {
                _context.Goals.Add(goal);
                _context.SaveChanges();
                return Ok(new { message = "Cél sikeresen létrehozva." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("UpdateGoal")]
        public IActionResult UpdateGoal(Goal goal)
        {
            try
            {
                if (_context.Goals.Contains(goal))
                {
                    _context.Update(goal);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen cél!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }
        }

        [HttpDelete("DeleteGoal/{Id}")]
        public IActionResult DeleteGoal(int Id)
        {

            try
            {
                if (_context.Goals.Select(g => g.GoalId).Contains(Id))
                {
                    Goal del = _context.Goals.FirstOrDefault(g => g.GoalId == Id);
                    _context.Remove(del);
                    _context.SaveChanges();
                    return Ok("Sikeres törlés!");
                }
                else
                {
                    return BadRequest("Nincs ilyen cél!");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a törlés közben: {ex.Message}");
            }

        }
    }
}