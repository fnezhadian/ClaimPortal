using System.ComponentModel.DataAnnotations;
namespace ClaimPortal.Api.Models;
public class Claim
{
    [Key]
    public int Id { get; set; }
    public string ClaimNo { get; set; }
    public string Description { get; set; }
    public int ClaimantId { get; set; }
    public Claimant? Claimant { get; set; }
    public DateTime SubmittedAt { get; set; }
    public decimal Amount { get; set; }
    public ClaimStatus Status { get; set; }    
}