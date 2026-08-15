using ClaimPortal.Api.Models;
namespace ClaimPortal.Api.DTOs;

public class UpdateClaimStatusRequest
{
    public ClaimStatus Status { get; set; }
}