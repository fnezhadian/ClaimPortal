import type { ClaimStatus } from './ClaimStatus';
export interface Claim {
  id: number;
  claimNo: string;
  description: string;
  claimantId: number;
  submittedAt: string;
  amount: number;
  status: ClaimStatus;
}

