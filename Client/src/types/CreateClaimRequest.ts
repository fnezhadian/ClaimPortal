export interface CreateClaimRequest {
  claimNo: string;
  description: string;
  claimantId: number;
  amount: number;
}