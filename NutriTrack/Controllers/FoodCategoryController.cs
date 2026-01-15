using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;

namespace NutriTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodCategoryController : ControllerBase
    {
        public readonly NutriTrack.Models.TesztContext _context;
        public FoodCategoryController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }

        //[Authorize(Roles = "10, 2")]
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


        [HttpPost("NewFoodCategory")]
        public IActionResult AddNewFoodCategory(FoodCategory foodCategory)
        {

            try
            {


                _context.Add(foodCategory);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }

        [HttpPut("ModifyFoodCategory")]
        public IActionResult ModifyFoodCategory(FoodCategory foodCategory)
        {

            try
            {
                if (_context.FoodCategories.Contains(foodCategory))
                {
                    _context.Update(foodCategory);
                    _context.SaveChanges();
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

        [HttpDelete("DelFoodCategory/{Id}")]
        public IActionResult DeleteFoodCategory(int Id)
        {

            try
            {
                if (_context.FoodCategories.Select(f => f.CategoryId).Contains(Id))
                {
                    FoodCategory del = _context.FoodCategories.FirstOrDefault(f => f.CategoryId == Id);
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
