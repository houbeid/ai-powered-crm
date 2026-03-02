using AiPoweredCrm.API.DTOs.Auth;
using AiPoweredCrm.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AiPoweredCrm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var message = await _authService.RegisterAsync(dto);
            return Ok(new { message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
           
            var token = await _authService.LoginAsync(dto);
            return Ok(new { token });
           
        }
    }
}