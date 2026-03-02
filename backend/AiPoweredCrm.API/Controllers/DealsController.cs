using AiPoweredCrm.API.DTOs.Deal;
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

        public DealsController(IDealService dealService)
        {
            _dealService = dealService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var deals = await _dealService.GetAllAsync();
                return Ok(deals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var deal = await _dealService.GetByIdAsync(id);
                if (deal == null)
                    return NotFound(new { message = "Deal not found" });
                return Ok(deal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            try
            {
                var deals = await _dealService.GetByClientIdAsync(clientId);
                return Ok(deals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DealCreateDto dto)
        {
            try
            {
                var deal = await _dealService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = deal.Id }, deal);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DealCreateDto dto)
        {
            try
            {
                var deal = await _dealService.UpdateAsync(id, dto);
                return Ok(deal);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _dealService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            try
            {
                var deal = await _dealService.UpdateStatusAsync(id, dto.Status);
                return Ok(deal);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}