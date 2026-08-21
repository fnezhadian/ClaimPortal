import type { Claim } from '../types/Claim';


export function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <div>
      <h2>{claim.claimNo}</h2>
      <p>{claim.description}</p>
      <p>{claim.amount}</p>
      <p>{claim.status}</p>
    </div>
  );
}