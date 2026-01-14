using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritrackAPI.Models;

namespace NutritrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemController : ControllerBase
    {
        public readonly NutritrackAPI.Models.NutritrackContext _context;
        public FoodItemController(NutritrackAPI.Models.NutritrackContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "10, 2")]
        [HttpGet("GetFoodItems")]
        public async Task<IActionResult> GetAllFoodItems()
        {

            try
            {
                List<FoodItem> FoodItems = await _context.FoodItems.ToListAsync();

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
                return BadRequest(new User()
                {
                    UserId = -1,
                    Username = $"Hiba történt: {ex.Message}",

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

        [HttpPut("ModifyFoodItem")]
        public IActionResult ModifyFoodItem(FoodItem foodItem)
        {

            try
            {
                if (_context.FoodItems.Contains(foodItem))
                {
                    _context.Update(foodItem);
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

        [HttpDelete("DelFoodItem/{Id}")]
        public IActionResult DeleteFoodItem(int Id)
        {

            try
            {
                if (_context.FoodItems.Select(f => f.FoodId).Contains(Id))
                {
                    FoodItem del = _context.FoodItems.FirstOrDefault(f => f.FoodId == Id);
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
