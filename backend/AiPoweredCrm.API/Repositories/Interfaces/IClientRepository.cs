using AiPoweredCrm.API.Entities;

namespace AiPoweredCrm.API.Repositories.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
        Task<Client> CreateAsync(Client client);
        Task<Client> UpdateAsync(Client client);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}