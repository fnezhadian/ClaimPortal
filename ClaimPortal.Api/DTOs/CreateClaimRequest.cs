using System.ComponentModel.DataAnnotations;

namespace ClaimPortal.Api.DTOs;

public class CreateClaimRequest
{
    [Required, MaxLength(50)]
    public string ClaimNo { get; set; }
    [Required, MaxLength(1000)]
    public string Description { get; set; }
    [Required]
    public int ClaimantId { get; set; }
    [Required, Range(0.01, 1000000, ErrorMessage = "Amount must be greater than zero.")]
    public decimal Amount { get; set; }
    [Required]
    public string CaptchaToken { get; set; }
}