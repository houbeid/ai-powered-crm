using System.ComponentModel.DataAnnotations;

namespace AiPoweredCrm.API.DTOs.Deal
{
    public class DealCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public int ClientId { get; set; }
    }
}