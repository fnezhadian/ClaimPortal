import type { Claim } from '../types/Claim';
import type { ClaimStatus } from '../types/ClaimStatus';

interface ClaimCardProps {
  claim: Claim;
  isAdmin: boolean;
  onStatusChange: (claimId: number, status: ClaimStatus) => void;
}

export function ClaimCard({ claim, isAdmin, onStatusChange }: ClaimCardProps) {
  return (
    <div>
      <h2>{claim.claimNo}</h2>
      <p>{claim.description}</p>
      <p>{claim.amount}</p>
      <p>{claim.status}</p>
      {isAdmin && onStatusChange && (
        <div>
          <button onClick={() => onStatusChange(claim.id, 'Approved')}>Approve</button>
          <button onClick={() => onStatusChange(claim.id, 'Rejected')}>Reject</button>
        </div>
      )}
    </div>
  );
}