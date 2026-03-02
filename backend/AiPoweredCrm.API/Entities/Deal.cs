using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Enums;

public class Deal
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DealStatus Status { get; set; } = DealStatus.New;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
}