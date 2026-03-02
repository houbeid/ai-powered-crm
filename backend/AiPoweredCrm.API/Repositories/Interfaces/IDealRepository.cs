using AiPoweredCrm.API.Entities;

namespace AiPoweredCrm.API.Repositories.Interfaces
{
    public interface IDealRepository
    {
        Task<List<Deal>> GetAllAsync();
        Task<List<Deal>> GetByClientIdAsync(int clientId);
        Task<Deal?> GetByIdAsync(int id);
        Task<Deal> CreateAsync(Deal deal);
        Task<Deal> UpdateAsync(Deal deal);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}