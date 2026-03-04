using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;

namespace NutriTrack.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FoodCategoryController : ControllerBase
    {
        private readonly NutriTrack.Models.TesztContext _context;

        public FoodCategoryController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "2,3")]
        [HttpGet("GetAllFoodCategories")]
        public async Task<IActionResult> GetAllFoodCategories()
        {
            try
            {
                List<FoodCategory> FoodCategories = await _context.FoodCategories.ToListAsync();
                return Ok(FoodCategories);
            }
            catch (Exception ex)
            {
                return BadRequest(new FoodCategory()
                {
                    CategoryId = -1,
                    CategoryName = $"Hiba történt: {ex.Message}",
                });
            }
        }

        [Authorize(Roles = "2,3")]
        [HttpGet("FoodCategoryById/{Id}")]
        public async Task<IActionResult> GetFoodCategoryById(int Id)
        {
            try
            {
                var foodCategory = await _context.FoodCategories.FirstOrDefaultAsync(f => f.CategoryId == Id);
                if (foodCategory is FoodCategory)
                {
                    return Ok(foodCategory);
                }
                else
                {
                    return BadRequest(new FoodCategory()
                    {
                        CategoryId = -1,
                        CategoryName = $"Hiba történt: Nincs ilyen azonosítójú étel",
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new FoodCategory()
                {
                    CategoryId = -1,
                    CategoryName = $"Hiba történt: {ex.Message}",
                });
            }
        }


        [Authorize(Roles = "3")]
        [HttpPost("NewFoodCategory")]
        public async Task<IActionResult> AddNewFoodCategory(FoodCategory foodCategory)
        {
            try
            {
                _context.Add(foodCategory);
                await _context.SaveChangesAsync();
                return Ok("Sikeres rögzítés");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }
        }

        [Authorize(Roles = "3")]
        [HttpPut("ModifyFoodCategory")]
        public async Task<IActionResult> ModifyFoodCategory(FoodCategory foodCategory)
        {
            try
            {
                if (_context.FoodCategories.Contains(foodCategory))
                {
                    _context.Update(foodCategory);
                    await _context.SaveChangesAsync();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen étel kategória!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }
        }

        [Authorize(Roles = "3")]
        [HttpDelete("DelFoodCategory/{Id}")]
        public async Task<IActionResult> DeleteFoodCategory(int Id)
        {
            try
            {
                if (_context.FoodCategories.Select(f => f.CategoryId).Contains(Id))
                {
                    FoodCategory del = _context.FoodCategories.FirstOrDefault(f => f.CategoryId == Id);
                    _context.Remove(del);
                    await _context.SaveChangesAsync();
                    return Ok("Sikeres törlés!");
                }
                else
                {
                    return BadRequest("Nincs ilyen étel kategória!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a törlés közben: {ex.Message}");
            }
        }
    }
}
