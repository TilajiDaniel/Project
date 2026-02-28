using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using NutriTrack.DTOs;
using NutriTrack.DTOs.NutriTrack.DTOs;
using NutriTrack.Models;
using System.Security.Claims;
using System.Text.Json;

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
        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }
        //[Authorize(Roles = "10, 2")]
        [HttpGet("GetAllMeals")]
        public async Task<ActionResult> GetAll()
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

        [HttpPost]
        public async Task<IActionResult> CreateMeal([FromBody] CreateMealDto dto)
        {
            try
            {
                // 1. Kinyerjük a bejelentkezett User ID-ját a Tokenből
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("Hiányzó token!");
                int currentUserId = int.Parse(userIdClaim.Value);

                // 2. Létrehozzuk a fő étkezés rekordot (Meal)
                var newMeal = new Meal
                {
                    UserId = currentUserId, // Itt adjuk hozzá a szerveroldalon!
                    MealDate = dto.MealDate,
                    MealType = dto.MealType
                };

                _context.Meals.Add(newMeal);
                await _context.SaveChangesAsync(); // Elmentjük, hogy legyen MealId

                // 3. Hozzáadjuk a tételeket (MealFoodItems)
                foreach (var item in dto.FoodItems)
                {
                    var mfi = new MealFoodItem
                    {
                        MealId = newMeal.MealId,
                        FoodId = item.FoodId,
                        QuantityGrams = item.QuantityGrams
                    };
                    _context.MealFoodItems.Add(mfi);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Sikeres mentés!" });
            }
            catch (Exception ex)
            {
                // Itt a konzolon látni fogod a pontos hibaüzenetet Visual Studioban
                return StatusCode(500, $"Belső hiba: {ex.Message}");
            }
        }
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayMeals()
        {
            try
            {
                int currentUserId = GetCurrentUserId();
                if (currentUserId == 0) return Unauthorized(new { message = "Érvénytelen felhasználó." });


                var today = DateTime.Now.Date; 
                var tomorrow = today.AddDays(1); 

                var queryResult = await _context.MealFoodItems
                    .Include(mfi => mfi.Food)
                    .Include(mfi => mfi.Meal)
                    .Where(mfi => mfi.Meal.UserId == currentUserId &&
                                  mfi.Meal.MealDate >= today &&
                                  mfi.Meal.MealDate < tomorrow)
                    .ToListAsync();

                var todayMeals = queryResult.Select(mfi => new
                {
                    itemKey = $"{mfi.MealId}_{mfi.FoodId}",
                    mealId = mfi.MealId,
                    foodId = mfi.FoodId,
                    mealType = mfi.Meal.MealType,
                    foodName = mfi.Food?.Name ?? "Ismeretlen étel",
                    quantityGrams = mfi.QuantityGrams ?? 0,
                    calories = (int)((double)(mfi.Food?.CaloriesPer100g ?? 0) * (mfi.QuantityGrams ?? 0) / 100),
                    protein = Math.Round((double)(mfi.Food?.ProteinPer100g ?? 0) * (mfi.QuantityGrams ?? 0) / 100, 1)
                })
                .ToList();

                return Ok(new
                {
                    meals = todayMeals,
                    summary = new
                    {
                        totalCalories = todayMeals.Sum(m => m.calories),
                        totalProtein = todayMeals.Sum(m => m.protein),
                        itemCount = todayMeals.Count
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("item/{mealId}/{foodId}")]
        public async Task<IActionResult> DeleteMealItem(int mealId, int foodId)
        {
            try
            {
                int currentUserId = GetCurrentUserId();
                if (currentUserId == 0) return Unauthorized(new { message = "Érvénytelen felhasználó." });

                var mealItem = await _context.MealFoodItems
                    .FirstOrDefaultAsync(mfi => mfi.MealId == mealId &&
                                               mfi.FoodId == foodId &&
                                               mfi.Meal.UserId == currentUserId);

                if (mealItem == null)
                    return NotFound(new { message = "Étel nem található" });

                _context.MealFoodItems.Remove(mealItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sikeres törlés!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Hiba a törlés közben: {ex.Message}" });
            }
        }



    }
}