using AiPoweredCrm.API.DTOs.Client;
using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Repositories.Interfaces;
using AiPoweredCrm.API.Services.Interfaces;

namespace AiPoweredCrm.API.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<List<ClientResponseDto>> GetAllAsync()
        {
            var clients = await _clientRepository.GetAllAsync();
            return clients.Select(MapToDto).ToList();
        }

        public async Task<ClientResponseDto?> GetByIdAsync(int id)
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null) return null;
            return MapToDto(client);
        }

        public async Task<ClientResponseDto> CreateAsync(ClientCreateDto dto)
        {
            var client = new Client
            {
                CompanyName = dto.CompanyName,
                Email = dto.Email,
                Phone = dto.Phone
            };

            var created = await _clientRepository.CreateAsync(client);
            return MapToDto(created);
        }

        public async Task<ClientResponseDto> UpdateAsync(int id, ClientCreateDto dto)
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null)
                throw new Exception("Client not found");

            client.CompanyName = dto.CompanyName;
            client.Email = dto.Email;
            client.Phone = dto.Phone;

            var updated = await _clientRepository.UpdateAsync(client);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _clientRepository.ExistsAsync(id))
                throw new Exception("Client not found");

            return await _clientRepository.DeleteAsync(id);
        }

        private ClientResponseDto MapToDto(Client client)
        {
            return new ClientResponseDto
            {
                Id = client.Id,
                CompanyName = client.CompanyName,
                Email = client.Email,
                Phone = client.Phone,
                CreatedAt = client.CreatedAt
            };
        }
    }
}