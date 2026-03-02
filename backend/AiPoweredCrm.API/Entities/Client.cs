namespace AiPoweredCrm.API.Entities
{
    public class Client
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Deal> Deals { get; set; } = new List<Deal>();
    }
}
