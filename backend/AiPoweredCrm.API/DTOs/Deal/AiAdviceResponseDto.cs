namespace AiPoweredCrm.API.DTOs.Deal
{
    public class AiAdviceResponseDto
    {
        public string Analysis { get; set; } = string.Empty;
        public string Obstacles { get; set; } = string.Empty;
        public string Recommendations { get; set; } = string.Empty;
        public string ClosingArgument { get; set; } = string.Empty;
    }
}