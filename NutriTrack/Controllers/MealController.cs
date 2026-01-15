using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealController : ControllerBase
    {
        public readonly NutriTrack.Models.TesztContext _context;
        public MealController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }

        //[Authorize(Roles = "10, 2")]
        [HttpGet("GetAllMeals")]
        public async Task<IActionResult> GetAllMeals()
        {

            try
            {
                List<Meal> Meals = await _context.Meals.ToListAsync();

                return Ok(Meals);

            }
            catch (Exception ex)
            {
                return BadRequest(new Meal()
                {
                    MealId = -1,
                    MealType = $"Hiba történt: {ex.Message}",


                });
            }


        }

        [HttpGet("MealById/{Id}")]
        public async Task<IActionResult> GetMealById(int Id)
        {

            try
            {
                var meal = await _context.Meals.FirstOrDefaultAsync(f => f.MealId == Id);
                if (meal is Meal)
                {
                    return Ok(meal);
                }
                else
                {
                    return BadRequest(new Meal()
                    {
                        MealId = -1,
                        MealType = $"Hiba történt: Nincs ilyen azonosítójú étel",

                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new Meal()
                {
                    MealId = -1,
                    MealType = $"Hiba történt: {ex.Message}",

                });
            }

        }


        [HttpPost("NewMeal")]
        public IActionResult AddNewMeal(Meal meal)
        {

            try
            {


                _context.Add(meal);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }

        [HttpPut("ModifyMeal")]
        public IActionResult ModifyMeal(Meal meal)
        {

            try
            {
                if (_context.Meals.Contains(meal))
                {
                    _context.Update(meal);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen étel!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }

        }

        [HttpDelete("DelMeal/{Id}")]
        public IActionResult DeleteMeal(int Id)
        {

            try
            {
                if (_context.Meals.Select(f => f.MealId).Contains(Id))
                {
                    Meal del = _context.Meals.FirstOrDefault(f => f.MealId == Id);
                    _context.Remove(del);
                    _context.SaveChanges();
                    return Ok("Sikeres törlés!");
                }
                else
                {
                    return BadRequest("Nincs ilyen felhasználó!");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a törlés közben: {ex.Message}");
            }

        }
    }
}
