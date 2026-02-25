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
            // 1. Megnézzük, hogy létezik-e már ez az étkezés (pl. az 1-es User mai Reggelije)
            var existingMeal = await _context.Meals
                .FirstOrDefaultAsync(m => m.UserId == dto.UserId
                                       && m.MealDate == dto.MealDate.Date
                                       && m.MealType == dto.MealType);

            int targetMealId;

            if (existingMeal != null)
            {
                // Ha MÁR LÉTEZIK (pl. ma már evett egy tojást reggelire), 
                // akkor nem hozunk létre új étkezést, csak felhasználjuk a meglévő ID-ját!
                targetMealId = existingMeal.MealId;
            }
            else
            {
                // Ha MÉG NINCS ilyen étkezés ma, akkor létrehozzuk a főétkezést
                var newMeal = new Meal
                {
                    UserId = dto.UserId,
                    MealDate = dto.MealDate.Date,
                    MealType = dto.MealType
                };

                _context.Meals.Add(newMeal);
                await _context.SaveChangesAsync(); // Itt kapjuk meg az új ID-t

                targetMealId = newMeal.MealId;
            }

            // 2. Ételek hozzárendelése (most már biztosan van egy jó MealId-nk)
            foreach (var item in dto.FoodItems)
            {
                var mealFoodItem = new MealFoodItem
                {
                    MealId = targetMealId, // <--- A megtalált vagy az újonnan létrehozott ID
                    FoodId = item.FoodId,
                    QuantityGrams = item.QuantityGrams
                };

                _context.MealFoodItems.Add(mealFoodItem);
            }

            // Ételek végleges mentése
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sikeres mentés!", mealId = targetMealId });
        }
    }
}
