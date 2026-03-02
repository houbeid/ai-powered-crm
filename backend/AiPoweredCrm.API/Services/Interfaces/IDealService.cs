using AiPoweredCrm.API.DTOs.Deal;

namespace AiPoweredCrm.API.Services.Interfaces
{
    public interface IDealService
    {
        Task<List<DealResponseDto>> GetAllAsync();
        Task<List<DealResponseDto>> GetByClientIdAsync(int clientId);
        Task<DealResponseDto?> GetByIdAsync(int id);
        Task<DealResponseDto> CreateAsync(DealCreateDto dto);
        Task<DealResponseDto> UpdateAsync(int id, DealCreateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<DealResponseDto> UpdateStatusAsync(int id, string status);
    }
}