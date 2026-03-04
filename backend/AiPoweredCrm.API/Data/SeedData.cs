using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Enums;
using Microsoft.EntityFrameworkCore;

namespace AiPoweredCrm.API.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            if (await context.Clients.AnyAsync()) return;

            // Clients
            var clients = new List<Client>
            {
                new Client
                {
                    CompanyName = "Microsoft",
                    Email = "contact@microsoft.com",
                    Phone = "+1 234 567 890",
                    CreatedAt = DateTime.UtcNow.AddMonths(-6)
                },
                new Client
                {
                    CompanyName = "Google",
                    Email = "contact@google.com",
                    Phone = "+1 234 567 891",
                    CreatedAt = DateTime.UtcNow.AddMonths(-5)
                },
                new Client
                {
                    CompanyName = "Amazon",
                    Email = "contact@amazon.com",
                    Phone = "+1 234 567 892",
                    CreatedAt = DateTime.UtcNow.AddMonths(-4)
                },
                new Client
                {
                    CompanyName = "Salesforce",
                    Email = "contact@salesforce.com",
                    Phone = "+1 234 567 893",
                    CreatedAt = DateTime.UtcNow.AddMonths(-3)
                },
                new Client
                {
                    CompanyName = "Apple",
                    Email = "contact@apple.com",
                    Phone = "+1 234 567 894",
                    CreatedAt = DateTime.UtcNow.AddMonths(-2)
                },
                new Client
                {
                    CompanyName = "Meta",
                    Email = "contact@meta.com",
                    Phone = "+1 234 567 895",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                }
            };

            await context.Clients.AddRangeAsync(clients);
            await context.SaveChangesAsync();

            // Deals
            var deals = new List<Deal>
            {
                // Microsoft deals
                new Deal
                {
                    Title = "Enterprise License",
                    Description = "Annual enterprise software license for 500 users",
                    Amount = 50000,
                    Status = DealStatus.New,
                    ClientId = clients[0].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Deal
                {
                    Title = "Security Audit",
                    Description = "Full security audit and penetration testing",
                    Amount = 25000,
                    Status = DealStatus.Lost,
                    ClientId = clients[0].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-60)
                },

                // Google deals
                new Deal
                {
                    Title = "Cloud Services",
                    Description = "Cloud infrastructure migration and services",
                    Amount = 30000,
                    Status = DealStatus.InProgress,
                    ClientId = clients[1].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new Deal
                {
                    Title = "AI Integration",
                    Description = "AI-powered analytics integration",
                    Amount = 45000,
                    Status = DealStatus.Won,
                    ClientId = clients[1].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-90)
                },

                // Amazon deals
                new Deal
                {
                    Title = "Support Package",
                    Description = "Annual support and maintenance package",
                    Amount = 15000,
                    Status = DealStatus.Won,
                    ClientId = clients[2].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-45)
                },
                new Deal
                {
                    Title = "Data Pipeline",
                    Description = "Real-time data pipeline implementation",
                    Amount = 60000,
                    Status = DealStatus.InProgress,
                    ClientId = clients[2].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },

                // Salesforce deals
                new Deal
                {
                    Title = "CRM Customization",
                    Description = "Custom CRM workflows and automation",
                    Amount = 35000,
                    Status = DealStatus.Won,
                    ClientId = clients[3].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-120)
                },
                new Deal
                {
                    Title = "Training Program",
                    Description = "Sales team training and onboarding",
                    Amount = 12000,
                    Status = DealStatus.New,
                    ClientId = clients[3].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },

                // Apple deals
                new Deal
                {
                    Title = "Mobile App Development",
                    Description = "iOS enterprise application development",
                    Amount = 80000,
                    Status = DealStatus.InProgress,
                    ClientId = clients[4].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Deal
                {
                    Title = "UX Consulting",
                    Description = "User experience consulting and design",
                    Amount = 20000,
                    Status = DealStatus.Lost,
                    ClientId = clients[4].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-75)
                },

                // Meta deals
                new Deal
                {
                    Title = "Social Media Integration",
                    Description = "Social media analytics and integration platform",
                    Amount = 40000,
                    Status = DealStatus.New,
                    ClientId = clients[5].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Deal
                {
                    Title = "VR Training Module",
                    Description = "Virtual reality employee training solution",
                    Amount = 55000,
                    Status = DealStatus.Won,
                    ClientId = clients[5].Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-100)
                }
            };

            await context.Deals.AddRangeAsync(deals);
            await context.SaveChangesAsync();
        }
    }
}