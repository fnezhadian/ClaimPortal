using Microsoft.EntityFrameworkCore;
using ClaimPortal.Api.Models;
using ClaimPortal.Api.Data;
using ClaimPortal.Api.DTOs;
namespace ClaimPortal.Api.Services;
public class ClaimService
{
    private readonly AppDbContext _context;

    public ClaimService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Claim>> GetClaimsAsync()
    {
        return await _context.Claims.ToListAsync();
    }

    public async Task<Claim?> GetClaimByIdAsync(int id)
    {
        return await _context.Claims.FindAsync(id);
    }

    public async Task<Claim> CreateClaimAsync(CreateClaimRequest request)
    {
        var claim = new Claim
        {
            ClaimNo = request.ClaimNo,
            Description = request.Description,
            ClaimantId = request.ClaimantId,
            Amount = request.Amount,
            Status = ClaimStatus.Submitted
        };

        _context.Claims.Add(claim);
        await _context.SaveChangesAsync();
        return claim;
    }

    public async Task<bool> UpdateClaimStatusAsync(int id, ClaimStatus status)
    {
        var claim = await _context.Claims.FindAsync(id);
        if (claim == null)
        {
            return false;
        }

        claim.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

   public async Task<bool> DeleteClaimAsync(int id)
    {
        var claim = await _context.Claims.FindAsync(id);
        if (claim == null)
        {
            return false;
        }

        _context.Claims.Remove(claim);
        await _context.SaveChangesAsync();
        return true;
    }
}