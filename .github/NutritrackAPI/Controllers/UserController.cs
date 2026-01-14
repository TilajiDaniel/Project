using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritrackAPI.Models;

namespace NutritrackAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        public readonly NutritrackAPI.Models.NutritrackContext _context;
        public UserController(NutritrackAPI.Models.NutritrackContext context)
        {
            _context = context;
        }
        [Authorize(Roles = "10, 2")]
        [HttpGet("Users")]
        public IActionResult GetAllUsers()
        {

            try
            {
                List<User> users = [.. _context.Users];

                return Ok(users);

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

        [HttpGet("UserById/{Id}")]
        public IActionResult GetUserById(int Id)
        {

            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == Id);
                if (user is User)
                {
                    return Ok(user);
                }
                else
                {
                    return BadRequest(new User()
                    {
                        UserId = -1,
                        Username = $"Hiba történt: Nincs ilyen azonosítójú felhasználó",
   
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


        [HttpPost("NewUser")]
        public IActionResult AddNewUser(User user)
        {

            try
            {
  

                _context.Add(user);
                _context.SaveChanges();
                return Ok("Sikeres rögzítés");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a felvétel során: {ex.Message}");
            }

        }

        [HttpPut("ModifyUser")]
        public IActionResult ModifyUser(User user)
        {

            try
            {
                if (_context.Users.Contains(user))
                {
                    _context.Update(user);
                    _context.SaveChanges();
                    return Ok("Sikeres módosítás!");
                }
                else
                {
                    return BadRequest("Nincs ilyen felhasználó!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a módosítás során: {ex.Message}");
            }

        }

        [HttpDelete("DelUser/{Id}")]
        public IActionResult DeleteUser(int Id)
        {

            try
            {
                if (_context.Users.Select(u => u.UserId).Contains(Id))
                {
                    User del = _context.Users.FirstOrDefault(u => u.UserId == Id);
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

