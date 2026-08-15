namespace ClaimPortal.Api.DTOs;

public class CreateClaimRequest
{
    public string ClaimNo { get; set; }
    public string Description { get; set; }
    public int ClaimantId { get; set; }
    public decimal Amount { get; set; }
}