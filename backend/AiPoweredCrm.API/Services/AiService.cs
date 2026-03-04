using AiPoweredCrm.API.DTOs.Deal;
using AiPoweredCrm.API.Services.Interfaces;
using System.Text;
using System.Text.Json;

namespace AiPoweredCrm.API.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AiService> _logger;

        public AiService(HttpClient httpClient,
                         IConfiguration configuration,
                         ILogger<AiService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AiAdviceResponseDto> GetDealAdviceAsync(
            DealResponseDto deal,
            List<DealResponseDto> similarDeals)
        {
            try
            {
                var model = _configuration["AI:Model"];

                var prompt = BuildPrompt(deal, similarDeals);

                var requestBody = new
                {
                    model = model,
                    messages = new[]
                    {
                        new
                        {
                            role = "system",
                            content = "You are an expert B2B sales coach. Always respond in valid JSON only."
                        },
                        new
                        {
                            role = "user",
                            content = prompt
                        }
                    },
                    response_format = new { type = "json_object" },
                    max_tokens = 1500,
                    temperature = 0.7
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // IMPORTANT: Now we use BaseAddress from Program.cs
                var response = await _httpClient.PostAsync("chat/completions", content);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("AI API error: {StatusCode} - {Error}",
                        response.StatusCode, error);

                    return GetFallbackAdvice();
                }

                var responseJson = await response.Content.ReadAsStringAsync();
                var responseObj = JsonSerializer.Deserialize<JsonElement>(responseJson);

                if (!responseObj.TryGetProperty("choices", out var choices))
                    return GetFallbackAdvice();

                var aiContent = choices[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (string.IsNullOrWhiteSpace(aiContent))
                    return GetFallbackAdvice();

                var advice = JsonSerializer.Deserialize<AiAdviceResponseDto>(
                    aiContent,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                return advice ?? GetFallbackAdvice();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling AI service");
                return GetFallbackAdvice();
            }
        }

        private string BuildPrompt(
    DealResponseDto deal,
    List<DealResponseDto> similarDeals)
        {
            var similarDealsText = similarDeals.Any()
                ? string.Join("\n", similarDeals.Select(d =>
                    $"- Title: {d.Title} | Client: {d.Client?.CompanyName} | Amount: ${d.Amount:N2}"))
                : "No similar won deals found yet.";

            return $@"
            You are a senior B2B enterprise sales strategist.

            STEP 1 - ANALYZE THE CURRENT DEAL
            - Title: {deal.Title}
            - Description: {deal.Description}
            - Amount: ${deal.Amount:N2}
            - Status: {deal.Status}
            - Client: {deal.Client?.CompanyName ?? "Unknown"}

            STEP 2 - REVIEW HISTORICAL WON DEALS
            {similarDealsText}

            STEP 3 - IDENTIFY THE MAIN OBSTACLES
            Based on patterns from won deals and the current deal context.

            STEP 4 - GENERATE ACTIONABLE RECOMMENDATIONS
            Concrete steps based on successful past strategies.

            STEP 5 - CRAFT A STRONG CLOSING ARGUMENT
            Use similar deals as social proof.

            IMPORTANT:
            - Think strategically.
            - Be concise but precise.
            - Respond in VALID JSON ONLY.
            - Do NOT include explanations outside JSON.

            Required JSON format:
            {{
                ""Analysis"": ""Detailed structured analysis"",
                ""Obstacles"": ""Top obstacles"",
                ""Recommendations"": ""Specific actions"",
                ""ClosingArgument"": ""Persuasive closing message""
            }}";
        }

        private AiAdviceResponseDto GetFallbackAdvice()
        {
            return new AiAdviceResponseDto
            {
                Analysis = "Unable to generate AI analysis at this time.",
                Obstacles = "Please try again later.",
                Recommendations = "Contact your sales manager for guidance.",
                ClosingArgument = "Focus on the value proposition of your product."
            };
        }
    }
}