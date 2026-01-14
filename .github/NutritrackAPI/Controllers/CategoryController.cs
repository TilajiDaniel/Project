using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritrackAPI.Models;

namespace NutritrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        public readonly NutritrackAPI.Models.NutritrackContext _context;
        public CategoryController(NutritrackAPI.Models.NutritrackContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "10, 2")]
        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetAllCategories()
        {

            try
            {
                List<Category> categories = await _context.Categories.ToListAsync();

                return Ok(categories);

            }
            catch (Exception ex)
            {
                return BadRequest(new Category()
                {
                    CategoryId = -1,
                    CategoryName = $"Hiba történt: {ex.Message}",


                });
            }


        }

        [HttpGet("CategoryById/{Id}")]
        public async Task<IActionResult> GetCategoryById(int Id)
        {

            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == Id);
                if (category is Category)
                {
                    return Ok(category);
                }
                else
                {
                    return BadRequest(new Category()
                    {
                        CategoryId = -1,
                        CategoryName = $"Hiba történt: Nincs ilyen azonosítójú kategória",

                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new Category()
                {
                    CategoryId = -1,
                    CategoryName = $"Hiba történt: {ex.Message}",

                });
            }

        }


        [HttpPost("NewCategory")]
        public IActionResult AddNewCategory(Category category)
        {

            try
            {


                _context.Add(category);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }

        [HttpPut("ModifyCategory")]
        public IActionResult ModifyCategory(Category category)
        {

            try
            {
                if (_context.Categories.Contains(category))
                {
                    _context.Update(category);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                    return BadRequest("Nincs ilyen kategória!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }

        }

        [HttpDelete("DelCategory/{Id}")]
        public IActionResult DeleteCategory(int Id)
        {

            try
            {
                if (_context.Categories.Select(c => c.CategoryId).Contains(Id))
                {
                    Category del = _context.Categories.FirstOrDefault(c => c.CategoryId == Id);
                    _context.Remove(del);
                    _context.SaveChanges();
                    return Ok("Sikeres törlés!");
                }
                else
                {
                    return BadRequest("Nincs ilyen kategória!");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a törlés közben: {ex.Message}");
            }

        }
    }
}
