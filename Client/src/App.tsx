import { ClaimForm } from './components/ClaimForm';
import { ClaimsList } from './components/ClaimsList';
import { getClaims, updateClaimStatus } from './api/claims';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { apiRequest } from './authConfig';
import { getAccessToken } from './auth/getToken';
import type { ClaimStatus } from './types/ClaimStatus';
import { isAdmin } from './auth/roles';
import { useApiResource } from './hooks/useApiResource';

function App() {
  const { data: claims, loading, reloadData: loadClaims } = useApiResource(getClaims);
  const { instance, accounts } = useMsal();

  async function handleStatusChange(claimId: number, status: ClaimStatus) {
      const token = await getAccessToken(instance, accounts[0]);
      await updateClaimStatus(token, claimId, status);    
      loadClaims(); 
  }

  function handleLogin() {
    instance.loginRedirect(apiRequest);
  }

  function handleLogout() {
    instance.logoutPopup();
  }

  return (
    <div>
      <h1>ClaimPortal</h1>

      <AuthenticatedTemplate>
        <p>Signed in as {accounts[0]?.username}</p>
        <button onClick={handleLogout}>Logout</button>
        <ClaimForm onClaimCreated={loadClaims} />
        {loading ? (
          <p>Loading claims...</p>
         ) : (<ClaimsList
            claims={claims} 
            isAdmin={isAdmin(accounts[0])}
            onStatusChange={handleStatusChange} 
          />
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <button onClick={handleLogin}>Login</button>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;