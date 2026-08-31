import type { Claim } from '../types/Claim';
import type { CreateClaimRequest } from '../types/CreateClaimRequest';

export async function getClaims(token:string): Promise<Claim[]> {
  const response = await fetch('/api/claims', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });  
  if (!response.ok) {
    throw new Error(`Failed to fetch claims: ${response.statusText}`);
  }
  return response.json() as Promise<Claim[]>;
}

export async function createClaim(token: string, request: CreateClaimRequest): Promise<Claim> {
  const response = await fetch('/api/claims', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to create claim: ${response.statusText}`);
  } 

  return response.json() as Promise<Claim>;

}