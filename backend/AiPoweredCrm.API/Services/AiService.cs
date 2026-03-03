using AiPoweredCrm.API.DTOs.Deal;
using AiPoweredCrm.API.Services.Interfaces;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AiPoweredCrm.API.Services
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AiService> _logger;

        public AiService(HttpClient httpClient, IConfiguration configuration, ILogger<AiService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AiAdviceResponseDto> GetDealAdviceAsync(DealResponseDto deal, List<DealResponseDto> similarDeals)
        {
            try
            {
                var apiKey = _configuration["AI:ApiKey"];
                var model = _configuration["AI:Model"];

                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", apiKey);

                var prompt = BuildPrompt(deal, similarDeals);

                var requestBody = new
                {
                    model = model,
                    messages = new[]
                    {
                        new
                        {
                            role = "system",
                            content = "You are an expert B2B sales coach with deep knowledge of enterprise sales strategies. You analyze deals using a structured chain of thought approach and provide actionable advice based on historical data. Always respond in JSON format only."
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

                var response = await _httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("OpenAI API error: {StatusCode}", response.StatusCode);
                    return GetFallbackAdvice();
                }

                var responseJson = await response.Content.ReadAsStringAsync();
                var responseObj = JsonSerializer.Deserialize<JsonElement>(responseJson);

                var aiContent = responseObj
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                var advice = JsonSerializer.Deserialize<AiAdviceResponseDto>(aiContent!,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return advice ?? GetFallbackAdvice();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling OpenAI API");
                return GetFallbackAdvice();
            }
        }

        private string BuildPrompt(DealResponseDto deal, List<DealResponseDto> similarDeals)
        {
            var similarDealsText = similarDeals.Any()
                ? string.Join("\n", similarDeals.Select(d =>
                    $"- Title: {d.Title} | Client: {d.Client?.CompanyName} | Amount: ${d.Amount:N2}"))
                : "No similar won deals found yet.";

            return $@"You are analyzing a B2B sales deal. Follow these steps carefully:

            STEP 1 - ANALYZE THE CURRENT DEAL:
            - Title: {deal.Title}
            - Description: {deal.Description}
            - Amount: ${deal.Amount:N2}
            - Status: {deal.Status}
            - Client: {deal.Client?.CompanyName ?? "Unknown"}

            STEP 2 - REVIEW SIMILAR DEALS ALREADY WON BY OUR TEAM:
            {similarDealsText}

            STEP 3 - IDENTIFY OBSTACLES:
            Based on the deal context and similar won deals, identify the main obstacles.

            STEP 4 - CRAFT RECOMMENDATIONS:
            Based on what worked in similar won deals, provide specific actionable recommendations.

            STEP 5 - CREATE CLOSING ARGUMENT:
            Using the success of similar deals as proof, craft a personalized closing argument.

            Respond with a JSON object containing exactly these fields:
            {{
                ""Analysis"": ""Detailed analysis of the deal based on similar won deals and current context"",
                ""Obstacles"": ""Top obstacles that could prevent closing this deal"",
                ""Recommendations"": ""Specific actions based on what worked in similar won deals"",
                ""ClosingArgument"": ""Personalized closing argument using similar won deals as social proof""
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