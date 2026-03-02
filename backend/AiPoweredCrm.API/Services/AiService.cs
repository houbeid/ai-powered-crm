using AiPoweredCrm.API.DTOs.Deal;
using AiPoweredCrm.API.Services.Interfaces;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;

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

        public async Task<AiAdviceResponseDto> GetDealAdviceAsync(DealResponseDto deal)
        {
            try
            {
                var apiKey = _configuration["AI:ApiKey"];
                var model = _configuration["AI:Model"];

                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", apiKey);

                var prompt = BuildPrompt(deal);

                var requestBody = new
                {
                    model = model,
                    messages = new[]
                    {
                        new
                        {
                            role = "system",
                            content = "You are an expert B2B sales coach. Analyze deals and provide actionable advice to help sales representatives close deals successfully. Always respond in JSON format only."
                        },
                        new
                        {
                            role = "user",
                            content = prompt
                        }
                    },
                    response_format = new { type = "json_object" },
                    max_tokens = 1000,
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

        private string BuildPrompt(DealResponseDto deal)
        {
            return $@"Analyze this B2B deal and provide sales advice:

            Deal Information:
            - Title: {deal.Title}
            - Description: {deal.Description}
            - Amount: ${deal.Amount:N2}
            - Status: {deal.Status}
            - Client: {deal.Client?.CompanyName ?? "Unknown"}

            Please respond with a JSON object containing exactly these fields:
            {{
                ""Analysis"": ""Brief analysis of the deal situation"",
                ""Obstacles"": ""Potential obstacles that could prevent closing"",
                ""Recommendations"": ""Specific actions to take to move the deal forward"",
                ""ClosingArgument"": ""The best argument to convince the client to buy""
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