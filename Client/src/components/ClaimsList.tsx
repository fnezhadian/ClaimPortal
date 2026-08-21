import type { Claim } from '../types/Claim';
import { ClaimCard } from './ClaimCard';


export function ClaimsList({claims}: {claims: Claim[]}) {
    return (
        <div>
            {claims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
            ))}
        </div>
    );
}