using AiPoweredCrm.API.DTOs.Client;

namespace AiPoweredCrm.API.Services.Interfaces
{
    public interface IClientService
    {
        Task<List<ClientResponseDto>> GetAllAsync();
        Task<ClientResponseDto?> GetByIdAsync(int id);
        Task<ClientResponseDto> CreateAsync(ClientCreateDto dto);
        Task<ClientResponseDto> UpdateAsync(int id, ClientCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}