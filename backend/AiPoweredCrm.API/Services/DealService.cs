using AiPoweredCrm.API.DTOs.Client;
using AiPoweredCrm.API.DTOs.Deal;
using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Enums;
using AiPoweredCrm.API.Repositories.Interfaces;
using AiPoweredCrm.API.Services.Interfaces;

namespace AiPoweredCrm.API.Services
{
    public class DealService : IDealService
    {
        private readonly IDealRepository _dealRepository;
        private readonly IClientRepository _clientRepository;

        public DealService(IDealRepository dealRepository, IClientRepository clientRepository)
        {
            _dealRepository = dealRepository;
            _clientRepository = clientRepository;
        }

        public async Task<List<DealResponseDto>> GetAllAsync()
        {
            var deals = await _dealRepository.GetAllAsync();
            return deals.Select(MapToDto).ToList();
        }

        public async Task<List<DealResponseDto>> GetByClientIdAsync(int clientId)
        {
            var deals = await _dealRepository.GetByClientIdAsync(clientId);
            return deals.Select(MapToDto).ToList();
        }

        public async Task<DealResponseDto?> GetByIdAsync(int id)
        {
            var deal = await _dealRepository.GetByIdAsync(id);
            if (deal == null) return null;
            return MapToDto(deal);
        }

        public async Task<DealResponseDto> CreateAsync(DealCreateDto dto)
        {
            // Vérifier si le client existe
            if (!await _clientRepository.ExistsAsync(dto.ClientId))
                throw new Exception("Client not found");

            var deal = new Deal
            {
                Title = dto.Title,
                Description = dto.Description,
                Amount = dto.Amount,
                Status = DealStatus.New,
                ClientId = dto.ClientId
            };

            var created = await _dealRepository.CreateAsync(deal);

            // Recharger avec le Client inclus
            var dealWithClient = await _dealRepository.GetByIdAsync(created.Id);
            return MapToDto(dealWithClient!);
        }

        public async Task<DealResponseDto> UpdateAsync(int id, DealCreateDto dto)
        {
            var deal = await _dealRepository.GetByIdAsync(id);
            if (deal == null)
                throw new Exception("Deal not found");

            // Vérifier si le client existe
            if (!await _clientRepository.ExistsAsync(dto.ClientId))
                throw new Exception("Client not found");

            deal.Title = dto.Title;
            deal.Description = dto.Description;
            deal.Amount = dto.Amount;
            deal.ClientId = dto.ClientId;

            var updated = await _dealRepository.UpdateAsync(deal);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _dealRepository.ExistsAsync(id))
                throw new Exception("Deal not found");

            return await _dealRepository.DeleteAsync(id);
        }

        public async Task<DealResponseDto> UpdateStatusAsync(int id, string status)
        {
            var deal = await _dealRepository.GetByIdAsync(id);
            if (deal == null)
                throw new Exception("Deal not found");

            // Vérifier que le statut est valide
            var validStatuses = Enum.GetValues<DealStatus>()
                        .Select(s => s.ToString())
                        .ToArray();

            if (!validStatuses.Contains(status))
                throw new Exception($"Invalid status. Valid values: {string.Join(", ", validStatuses)}");

            deal.Status = Enum.Parse<DealStatus>(status);
            var updated = await _dealRepository.UpdateAsync(deal);
            return MapToDto(updated);
        }

        private DealResponseDto MapToDto(Deal deal)
        {
            return new DealResponseDto
            {
                Id = deal.Id,
                Title = deal.Title,
                Description = deal.Description,
                Amount = deal.Amount,
                Status = deal.Status.ToString(),
                CreatedAt = deal.CreatedAt,
                ClientId = deal.ClientId,
                Client = deal.Client == null ? null : new ClientResponseDto
                {
                    Id = deal.Client.Id,
                    CompanyName = deal.Client.CompanyName,
                    Email = deal.Client.Email,
                    Phone = deal.Client.Phone,
                    CreatedAt = deal.Client.CreatedAt
                }
            };
        }
    }
}