using AiPoweredCrm.API.DTOs.Deal;
using AiPoweredCrm.API.Services;
using AiPoweredCrm.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiPoweredCrm.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DealsController : ControllerBase
    {
        private readonly IDealService _dealService;
        private readonly IAiService _aiService;

        public DealsController(IDealService dealService, IAiService aiService)
        {
            _dealService = dealService;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var deals = await _dealService.GetAllAsync();
            return Ok(deals);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var deal = await _dealService.GetByIdAsync(id);
            if (deal == null)
                return NotFound(new { message = "Deal not found" });
            return Ok(deal);
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            var deals = await _dealService.GetByClientIdAsync(clientId);
            return Ok(deals);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DealCreateDto dto)
        {
            var deal = await _dealService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = deal.Id }, deal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DealCreateDto dto)
        {
            var deal = await _dealService.UpdateAsync(id, dto);
            return Ok(deal);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _dealService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var deal = await _dealService.UpdateStatusAsync(id, dto.Status);
            return Ok(deal);
        }

        [HttpPost("{id}/ai-advice")]
        public async Task<IActionResult> GetAiAdvice(int id)
        {
            var deal = await _dealService.GetByIdAsync(id);
            if (deal == null)
                return NotFound(new { message = "Deal not found" });

            // Récupère les deals similaires déjà Won
            var allDeals = await _dealService.GetAllAsync();
            var similarDeals = allDeals
                .Where(d => d.Status == "Won" && d.Id != id)
                .ToList();

            var advice = await _aiService.GetDealAdviceAsync(deal, similarDeals);
            return Ok(advice);
        }
    }
}