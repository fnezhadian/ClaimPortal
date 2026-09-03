using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClaimPortal.Api.Services;
using ClaimPortal.Api.Models;
using ClaimPortal.Api.DTOs;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly ClaimService _claimService;

    public ClaimsController(ClaimService claimService)
    {
        _claimService = claimService;
    }

    // GET: api/Claims
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Claim>>> GetClaims()
    {
        var claims = await _claimService.GetClaimsAsync();
        return Ok(claims);
    }

    // GET: api/Claims/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Claim>> GetClaim(int id)
    {
        var claim = await _claimService.GetClaimByIdAsync(id);

        if (claim == null)
        {
            return NotFound();
        }

        return claim;
    }

    // POST: api/Claims
    [HttpPost]
    public async Task<ActionResult<Claim>> PostClaim([FromBody] CreateClaimRequest request)
    {
        var createdClaim = await _claimService.CreateClaimAsync(request);
        return CreatedAtAction(nameof(GetClaim), new { id = createdClaim.Id }, createdClaim);
    }
    [HttpPatch("{id}/status")] 
    public async Task<IActionResult> UpdateClaim(int id, [FromBody]UpdateClaimStatusRequest request)
    {
        var result = await _claimService.UpdateClaimStatusAsync(id, request.Status);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClaim(int id)
    {
        var result = await _claimService.DeleteClaimAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}