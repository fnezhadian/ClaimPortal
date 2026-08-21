import type { Claim } from '../types/Claim';
import type { CreateClaimRequest } from '../types/CreateClaimRequest';

export async function getClaims(): Promise<Claim[]> {
  const response = await fetch('/api/claims');  
  if (!response.ok) {
    throw new Error(`Failed to fetch claims: ${response.statusText}`);
  }
  return response.json() as Promise<Claim[]>;
}

export async function createClaim(request: CreateClaimRequest): Promise<Claim> {
  const response = await fetch('/api/claims', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create claim: ${response.statusText}`);
  } 

  return response.json() as Promise<Claim>;

}