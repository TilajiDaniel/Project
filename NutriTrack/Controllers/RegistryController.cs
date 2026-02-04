using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutriTrack.Models;
using NutriTrack.DTOs;
namespace NutriTrack.Controllers
{
     [Route("api/[controller]")]
    [ApiController]
    public class RegistryController : Controller
    {

        public readonly NutriTrack.Models.TesztContext _context;
        public readonly NutriTrack.DTOs.RegistryDTO _reg;

        public RegistryController(NutriTrack.Models.TesztContext context)
        {
            _context = context;
        }
        [HttpPost("reg")]
        public async Task<IActionResult> PostRegistry(RegistryDTO dto)
        {
            try
            {
                if (_context.Users.FirstOrDefault(d => d.Username == dto.Username) != null)
                {
                    return BadRequest("Felhasználónév már foglalt. ");
                }
                if (_context.Users.FirstOrDefault(d => d.Email == dto.Email) != null)
                {
                    return BadRequest("Ezzel az E-mail címmel már regisztráltak. ");
                }
                dto.PasswordHash = NutriTrack.Helpers.PasswordHasher.HashPassword(dto.PasswordHash);

                dto.Privilege = 1;
                dto.CreatedAt = DateTime.Now;

                User ujUser = new User() { 
                    UserId=-1,
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = dto.PasswordHash,
                    CreatedAt = dto.CreatedAt
                };
                _context.Users.Add(ujUser); 
                await _context.SaveChangesAsync();
                return Ok("Sikeres regisztráció! Most már beléphetsz.");
                //user.Active = false;
                //user.Permission = 1;
                //user.Hash = Program.CreateSHA256(user.Hash);
                //await _context.Users.AddAsync(user);
                //await _context.SaveChangesAsync();
                //Program.SendEmail(user.Email, "Regisztráció megerősítése", $"Kedves {user.Name}!\n\nKöszönjük, hogy regisztrált a Cégautók rendszerébe! Kérjük, erősítse meg regisztrációját az alábbi linkre kattintva:\n\nhttp://http://localhost:5109/Registry?felhasznaloNev={user.LoginName}&email={user.Email}");
                //return Ok("Sikeres regissztráció, erősítse meg a megadott emailre kiküldött linkre kattintva.");

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt: {ex.Message}");
            }
        }

        //[HttpGet]
        //public async Task<IActionResult> GetRegistry([FromQuery] string felhasznaloNev, [FromQuery] string email)
        //{
        //    try
        //    {
        //        User user = await _context.Users.FirstOrDefaultAsync(u => u.Username == felhasznaloNev && u.Email == email);
        //        if (user != null)
        //        {
        //            //user.Active = true;
        //            //user.Permission = 2;
        //            //_context.Users.Update(user);
        //            //await _context.SaveChangesAsync();
        //            //return Ok("Sikeres regisztráció megerősítés, mostantól be tud jelentkezni.");
        //            return Ok("Regisztráció megerősítése jelenleg nem elérhető.");
        //        }
        //        else
        //        {
        //            return BadRequest("Hiba történt: Nincs ilyen felhasználó.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Hiba történt: {ex.Message}");
        //    }
        //}

        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] NutriTrack.Models.User loginData)
        //{
        //    // 1. Megkeressük a felhasználót név alapján
        //    var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginData.Username);

        //    if (dbUser == null)
        //    {
        //        return BadRequest("Nincs ilyen felhasználó.");
        //    }

        //    // 2. Jelszó ellenőrzése (1-es kód beépítve)
        //    // loginData.PasswordHash -> Amit most írt be (sima szöveg)
        //    // dbUser.PasswordHash -> Ami az adatbázisban van (titkosított)
        //    bool isPasswordValid = NutriTrack.Helpers.PasswordHasher.VerifyPassword(loginData.PasswordHash, dbUser.PasswordHash);

        //    if (!isPasswordValid)
        //    {
        //        return BadRequest("Hibás jelszó!");
        //    }

        //    // 3. SIKER
        //    return Ok("Sikeres belépés!");
        //    // (Később ide jön majd a Token generálás, ha azt is megcsináljuk)
        //}

    }
}
