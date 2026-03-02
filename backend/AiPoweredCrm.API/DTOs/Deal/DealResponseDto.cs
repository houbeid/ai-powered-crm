using AiPoweredCrm.API.DTOs.Client;

namespace AiPoweredCrm.API.DTOs.Deal
{
    public class DealResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int ClientId { get; set; }
        public ClientResponseDto? Client { get; set; }
    }
}