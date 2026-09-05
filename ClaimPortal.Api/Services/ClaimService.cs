using Microsoft.EntityFrameworkCore;
using ClaimPortal.Api.Models;
using ClaimPortal.Api.Data;
using ClaimPortal.Api.DTOs;
using System.Net.Http.Json;

namespace ClaimPortal.Api.Services;
public class ClaimService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ClaimService(AppDbContext context, HttpClient httpClient, IConfiguration configuration)
    {
        _context = context;
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<bool> VerifyCaptchaAsync(string captchaToken)
    {
        var secretKey = _configuration["ReCAPTCHA:SecretKey"];
        var response = await _httpClient.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={captchaToken}", null);
        
        var json = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("success").GetBoolean();
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
        var isCaptchaValid = await VerifyCaptchaAsync(request.CaptchaToken);
        if (!isCaptchaValid)
        {
            throw new InvalidOperationException("Captcha verification failed.");
        }

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