using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritrackAPI.Models;

namespace NutritrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealFoodController : ControllerBase
    {
        public readonly NutritrackAPI.Models.NutritrackContext _context;
        public MealFoodController(NutritrackAPI.Models.NutritrackContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "10, 2")]
        [HttpGet("GetAllMealFoods")]
        public async Task<IActionResult> GetAllMealFoods()
        {

            try
            {
                List<MealFood> mealFoods = await _context.MealFoods.ToListAsync();

                return Ok(mealFoods);

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt: {ex.Message}");
            }


        }

        //[HttpGet("MealFoodById/{Id}")]
        //public async Task<IActionResult> GetMealFoodById(int Id)
        //{

        //    try
        //    {
        //        var mealFood = await _context.MealFoods.FirstOrDefaultAsync(mf => mf.MealFoodId == Id);
        //        if (mealFood is MealFood)
        //        {
        //            return Ok(mealFood);
        //        }
        //        else
        //        {
        //           return BadRequest($"Nem található ilyen étkezés-étel kapcsolat!");
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Hiba történt: {ex.Message}");
        //    }
        //    }

        

        [HttpPost("NewMealFood")]
        public IActionResult AddNewMealFood(MealFood mealFood)
        {

            try
            {


                _context.Add(mealFood);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }

        [HttpPut("ModifyMealFood")]
        public IActionResult ModifyMealFood(MealFood mealFood)
        {

            try
            {
                if (_context.MealFoods.Contains(mealFood))
                {
                    _context.Update(mealFood);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen étkezés-étel kapcsolat!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }

        }

        //[HttpDelete("DelMealFood/{Id}")]
        //public IActionResult DeleteMealFood(int Id)
        //{

        //    try
        //    {
        //        if (_context.MealFoods.Select(mf => mf.MealId).Contains(Id))
        //        {
        //            MealFood del = _context.MealFoods.FirstOrDefault(mf => mf.MealId == Id);
        //            _context.Remove(del);
        //            _context.SaveChanges();
        //            return Ok("Sikeres törlés!");
        //        }
        //        else
        //        {
        //            return BadRequest("Nincs ilyen felhasználó!");
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Hiba a törlés közben: {ex.Message}");
        //    }

        //}
    }
}
