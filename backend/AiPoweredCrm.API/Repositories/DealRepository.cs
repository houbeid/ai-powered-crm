using AiPoweredCrm.API.Data;
using AiPoweredCrm.API.Entities;
using AiPoweredCrm.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AiPoweredCrm.API.Repositories
{
    public class DealRepository : IDealRepository
    {
        private readonly AppDbContext _context;

        public DealRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Deal>> GetAllAsync()
        {
            return await _context.Deals
                .Include(d => d.Client)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Deal>> GetByClientIdAsync(int clientId)
        {
            return await _context.Deals
                .Include(d => d.Client)
                .Where(d => d.ClientId == clientId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<Deal?> GetByIdAsync(int id)
        {
            return await _context.Deals
                .Include(d => d.Client)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Deal> CreateAsync(Deal deal)
        {
            _context.Deals.Add(deal);
            await _context.SaveChangesAsync();
            return deal;
        }

        public async Task<Deal> UpdateAsync(Deal deal)
        {
            _context.Deals.Update(deal);
            await _context.SaveChangesAsync();
            return deal;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var deal = await _context.Deals.FindAsync(id);
            if (deal == null) return false;

            _context.Deals.Remove(deal);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Deals
                .AnyAsync(d => d.Id == id);
        }
    }
}