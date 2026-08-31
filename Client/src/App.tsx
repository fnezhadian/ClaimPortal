import { useState, useEffect } from 'react';
import { ClaimForm } from './components/ClaimForm';
import { ClaimsList } from './components/ClaimsList';
import type { Claim } from './types/Claim';
import { getClaims } from './api/claims';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { apiRequest } from './authConfig';
import { getAccessToken } from './auth/getToken';

function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

function loadClaims() {
  setLoading(true);
  getAccessToken(instance, accounts[0])
    .then(token => getClaims(token))
    .then((data) => {
      setClaims(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching claims:', error);
      setLoading(false);
    });
}

  useEffect(() => {
    loadClaims();
  }, []);

  const { instance, accounts } = useMsal();

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
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <button onClick={handleLogin}>Login</button>
      </UnauthenticatedTemplate>

      <ClaimForm onClaimCreated={loadClaims} />
      {loading ? <p>Loading claims...</p> : <ClaimsList claims={claims} />}
    </div>
  );
}

export default App;