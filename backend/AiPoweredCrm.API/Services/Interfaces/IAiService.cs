using AiPoweredCrm.API.DTOs.Deal;

namespace AiPoweredCrm.API.Services.Interfaces
{
    public interface IAiService
    {
        Task<AiAdviceResponseDto> GetDealAdviceAsync(DealResponseDto deal, List<DealResponseDto> similarDeals);
    }
}