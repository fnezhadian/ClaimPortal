import { useState, useEffect } from 'react';
import { ClaimForm } from './components/ClaimForm';
import { ClaimsList } from './components/ClaimsList';
import type { Claim } from './types/Claim';
import { getClaims } from './api/claims';

function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  function loadClaims() {
    setLoading(true);
    getClaims()
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

  return (
    <div>
      <h1>ClaimPortal</h1>
      <ClaimForm onClaimCreated={loadClaims} />
      {loading ? <p>Loading claims...</p> : <ClaimsList claims={claims} />}
    </div>
  );
}

export default App;