using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.DTOs;
using NutriTrack.Models;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemController : ControllerBase
    {
        public readonly NutriTrack.Models.TesztContext _context;
        public FoodItemController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }


        [HttpGet("GetFoodItems")]
        public async Task<IActionResult> GetAllFoodItems()
        {

            try
            {
                   List<FoodItem> FoodItems = await _context.FoodItems
                    .Include(f => f.Category)  
                    .ToListAsync();

                return Ok(FoodItems);

            }
            catch (Exception ex)
            {
                return BadRequest(new FoodItem()
                {
                    FoodId = -1,
                    Name = $"Hiba történt: {ex.Message}",


                });
            }


        }

        [HttpPut("UpdateFoodItem/{id}")]
        public IActionResult UpdateFood(FoodItem food)
        {
            try
            {
                if(_context.FoodItems.Any(f => f.FoodId == food.FoodId))
                {
                    _context.FoodItems.Update(food);
                    return Ok(new { message = "Sikeres frissítés!" });
                }
                else
                {
                    return NotFound(new { message = "Nincs ilyen étel!" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Szerver hiba a mentésnél!", details = ex.Message });
            }
        }


        [HttpDelete("DeleteFoodItem/{id}")]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            var food = await _context.FoodItems.FindAsync(id);
            if (food == null)
                return NotFound(new { message = "Nincs ilyen étel!" });

            try
            {
                _context.FoodItems.Remove(food);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Étel sikeresen törölve!" });
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Nem törölhető! Valószínűleg már használatban van egy naplóban." });
            }
        }




        [HttpGet("FoodItemById/{Id}")]
        public async Task<IActionResult> GetFoodItemById(int Id)
        {

            try
            {
                var foodItem = await _context.FoodItems.FirstOrDefaultAsync(f => f.FoodId == Id);
                if (foodItem is FoodItem)
                {
                    return Ok(foodItem);
                }
                else
                {
                    return BadRequest(new FoodItem()
                    {
                        FoodId = -1,
                        Name = $"Hiba történt: Nincs ilyen azonosítójú étel",

                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new FoodItem()
                {
                    FoodId = -1,
                    Name = $"Hiba történt: {ex.Message}",

                });
            }

        }


        [HttpPost("NewFoodItem")]
        public IActionResult AddNewFoodItem(FoodItem foodItem)
        {

            try
            {


                _context.Add(foodItem);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }


        

        
    }
}
