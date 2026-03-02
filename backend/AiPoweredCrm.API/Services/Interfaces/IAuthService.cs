using AiPoweredCrm.API.DTOs.Auth;

namespace AiPoweredCrm.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto dto);
        Task<string> LoginAsync(LoginDto dto);
    }
}