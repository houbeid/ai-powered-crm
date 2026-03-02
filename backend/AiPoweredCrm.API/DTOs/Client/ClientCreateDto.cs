using System.ComponentModel.DataAnnotations;

namespace AiPoweredCrm.API.DTOs.Client
{
    public class ClientCreateDto
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;
    }
}