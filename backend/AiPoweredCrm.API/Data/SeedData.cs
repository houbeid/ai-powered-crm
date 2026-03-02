using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Enums;
using Microsoft.EntityFrameworkCore;

namespace AiPoweredCrm.API.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            // Vérifier si les données existent déjà
            if (await context.Clients.AnyAsync()) return;

            // Clients
            var clients = new List<Client>
            {
                new Client
                {
                    CompanyName = "Microsoft",
                    Email = "contact@microsoft.com",
                    Phone = "+1 234 567 890",
                    CreatedAt = DateTime.UtcNow
                },
                new Client
                {
                    CompanyName = "Google",
                    Email = "contact@google.com",
                    Phone = "+1 234 567 891",
                    CreatedAt = DateTime.UtcNow
                },
                new Client
                {
                    CompanyName = "Amazon",
                    Email = "contact@amazon.com",
                    Phone = "+1 234 567 892",
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Clients.AddRangeAsync(clients);
            await context.SaveChangesAsync();

            // Deals
            var deals = new List<Deal>
            {
                new Deal
                {
                    Title = "Enterprise License",
                    Description = "Annual enterprise software license",
                    Amount = 50000,
                    Status = DealStatus.New,
                    ClientId = clients[0].Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Deal
                {
                    Title = "Cloud Services",
                    Description = "Cloud infrastructure services",
                    Amount = 30000,
                    Status = DealStatus.InProgress,
                    ClientId = clients[1].Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Deal
                {
                    Title = "Support Package",
                    Description = "Annual support and maintenance",
                    Amount = 15000,
                    Status = DealStatus.Won,
                    ClientId = clients[2].Id,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Deals.AddRangeAsync(deals);
            await context.SaveChangesAsync();
        }
    }
}