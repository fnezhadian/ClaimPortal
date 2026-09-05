using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
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
        if (User.IsInRole("Admin"))
        {
            return Ok(await _claimService.GetClaimsAsync());
        }

        // for a claimant, you'd need a way to map the logged-in user's identity
        // to a specific ClaimantId — a gap worth naming explicitly if not built

        // NOTE: Claimant-level data isolation not yet implemented —
        // this currently returns ALL claims to any authenticated user.
        // A full implementation would restrict non-admin users to only
        // their own claims, once Entra ID identity is mapped to a
        // ClaimantId. See README "Known limitations".


        return Forbid();
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

        // NOTE: Claimant-level ownership check not yet implemented —
        // requires linking Entra ID user identity to a ClaimantId.
        // Currently any authenticated user can view any claim by id.
        // Admins should always have access; non-admins should be
        // restricted to their own ClaimantId once that mapping exists.

        return claim;
    }

    // POST: api/Claims
    [HttpPost]
    [EnableRateLimiting("ClaimSubmission")]
    public async Task<ActionResult<Claim>> PostClaim([FromBody] CreateClaimRequest request)
    {
        try
        {
            var createdClaim = await _claimService.CreateClaimAsync(request);
            return CreatedAtAction(nameof(GetClaim), new { id = createdClaim.Id }, createdClaim);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }        
    }

    [HttpPatch("{id}/status")] 
    [Authorize(Roles = "Admin")]
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