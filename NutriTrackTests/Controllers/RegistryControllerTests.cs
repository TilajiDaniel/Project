using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using NutriTrack.Controllers;
using NutriTrack.Models;
using NutriTrack.DTOs;
using NutriTrack.Helpers;

namespace NutriTrack.Controllers.Tests
{
    [TestClass()]
    public class RegistryControllerTests
    {
        private TesztContext _context;
        private RegistryController _controller;
        private IConfiguration _config;
        private Jwtsettings _jwtSettings;

        [TestInitialize]
        public void Init()
        {
            var options = new DbContextOptionsBuilder<TesztContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_" + System.Guid.NewGuid())
                .Options;

            _context = new TesztContext(options);

            string secretKey = "EZ_EGY_NAGYON_HOSSZU_BIZTONSAGOS_KULCS_AMI_MINIMUM_32_KARAKTER!!!";

            var settings = new Dictionary<string, string>
            {
                {"Jwt:SecretKey", secretKey},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"},
                {"EmailSettings:AppBaseUrl", "https://localhost:7133"}
            };

            _config = new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();

            _jwtSettings = new Jwtsettings
            {
                SecretKey = secretKey,
                Issuer = "TestIssuer",
                Audience = "TestAudience"
            };

            _controller = new RegistryController(_context, _jwtSettings, _config);
        }

        [TestMethod()]
        public async Task Login_ValidUser_ReturnsOk()
        {
            var user = new User
            {
                Username = "tesztuser",
                Email = "teszt@example.com",
                Privilege = 0,
                PasswordHash = PasswordHasher.HashPassword("123456")
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var dto = new LoginDTO
            {
                Username = "tesztuser",
                Password = "123456"
            };

            var result = await _controller.Login(dto);
            var okResult = result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod()]
        public async Task Login_UnverifiedEmail_ReturnsUnauthorized()
        {
            var user = new User
            {
                Username = "unverified",
                Email = "unverified@example.com",
                Privilege = 1,
                PasswordHash = PasswordHasher.HashPassword("123456")
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var dto = new LoginDTO
            {
                Username = "unverified",
                Password = "123456"
            };

            var result = await _controller.Login(dto);
            var unauthorized = result as UnauthorizedObjectResult;

            Assert.IsNotNull(unauthorized);
            Assert.AreEqual(401, unauthorized.StatusCode);
        }

        [TestMethod()]
        public async Task Register_ValidUser_CreatesUserWithToken()
        {
            var dto = new RegistryDTO
            {
                Username = "ujuser",
                Email = "ujuser@example.com",
                Password = "123456"
            };

            var result = await _controller.Register(dto);

            var savedUser = _context.Users.FirstOrDefault(u => u.Username == "ujuser");

            Assert.IsNotNull(savedUser);
            Assert.AreEqual("ujuser@example.com", savedUser.Email);
            Assert.AreEqual(1, savedUser.Privilege);
            Assert.IsFalse(string.IsNullOrEmpty(savedUser.EmailVerificationToken));
            Assert.IsNotNull(savedUser.VerificationTokenExpiry);
            Assert.IsTrue(savedUser.VerificationTokenExpiry > DateTime.UtcNow);
        }

        [TestMethod()]
        public async Task Register_DuplicateUsername_ReturnsBadRequest()
        {
            _context.Users.Add(new User
            {
                Username = "tesztuser",
                Email = "regi@example.com",
                PasswordHash = PasswordHasher.HashPassword("123456"),
                Privilege = 1
            });
            await _context.SaveChangesAsync();

            var dto = new RegistryDTO
            {
                Username = "tesztuser",
                Email = "uj@example.com",
                Password = "123456"
            };

            var result = await _controller.Register(dto);
            var badRequest = result as BadRequestObjectResult;

            Assert.IsNotNull(badRequest);
            Assert.AreEqual(400, badRequest.StatusCode);
        }

        [TestMethod()]
        public async Task Register_DuplicateEmail_ReturnsBadRequest()
        {
            _context.Users.Add(new User
            {
                Username = "regiuser",
                Email = "teszt@example.com",
                PasswordHash = PasswordHasher.HashPassword("123456"),
                Privilege = 1
            });
            await _context.SaveChangesAsync();

            var dto = new RegistryDTO
            {
                Username = "ujuser",
                Email = "teszt@example.com",
                Password = "123456"
            };

            var result = await _controller.Register(dto);
            var badRequest = result as BadRequestObjectResult;

            Assert.IsNotNull(badRequest);
            Assert.AreEqual(400, badRequest.StatusCode);
        }
    }
}