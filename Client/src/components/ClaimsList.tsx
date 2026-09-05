import type { Claim } from '../types/Claim';
import { ClaimCard } from './ClaimCard';
import type { ClaimStatus } from '../types/ClaimStatus';

interface ClaimsListProps {
  claims: Claim[];
  isAdmin: boolean;
  onStatusChange: (claimId: number, status: ClaimStatus) => void;
}

export function ClaimsList({ claims, isAdmin, onStatusChange }: ClaimsListProps) {
    return (
        <div>
            {claims.map((claim) => (
                <ClaimCard 
                key={claim.id} 
                claim={claim} 
                isAdmin={isAdmin}
                onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}