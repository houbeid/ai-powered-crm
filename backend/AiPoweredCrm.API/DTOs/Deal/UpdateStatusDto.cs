using System.ComponentModel.DataAnnotations;

namespace AiPoweredCrm.API.DTOs.Deal
{
    public class UpdateStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}