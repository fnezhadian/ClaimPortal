# ClaimPortal — Client

React + TypeScript + Vite frontend for ClaimPortal, a mini Class Action claims administration system. Talks to the [ClaimPortal.Api](../ClaimPortal.Api) backend.

## Architecture

`App` owns the shared claims state, data-fetching, and auth state (via MSAL). `ClaimsList`/`ClaimCard` handle display and (for Admins) status-update actions. `ClaimForm` handles submission, including reCAPTCHA. Children communicate back to `App` via callback props after actions complete, so `App` can refetch and keep everything in sync.

![Data flow](docs/data-flow.svg)

## Project structure

```
client/
  src/
    components/   # ClaimCard, ClaimsList, ClaimForm
    auth/          # getToken.ts (token acquisition), roles.ts (isAdmin check)
    hooks/         # Reserved for future use
    types/         # TS interfaces mirroring the API's DTOs (Claim, CreateClaimRequest, ClaimStatus)
    api/           # Functions calling the backend (getClaims, createClaim, updateClaimStatus)
    authConfig.ts   # MSAL configuration (client ID, tenant ID, API scope)
    App.tsx        # Owns claims + auth state, wires everything together
    main.tsx       # Entry point, wraps App in MsalProvider
  vite.config.ts    # Dev server + API proxy config
```

## npm packages

Scaffolded with:
```
npm create vite@latest client -- --template react-ts
```

Additional packages installed on top of the Vite scaffold:
```
npm install @azure/msal-browser @azure/msal-react
npm install react-google-recaptcha
npm install -D @types/react-google-recaptcha
```

- **@azure/msal-browser + @azure/msal-react** — Entra ID login (redirect flow), token acquisition, and React hooks/context (`useMsal`, `AuthenticatedTemplate`)
- **react-google-recaptcha** — reCAPTCHA v2 checkbox widget on the claim submission form
- **@types/react-google-recaptcha** — TypeScript types for the above (dev dependency only)

## Authentication

- Microsoft Entra ID via `@azure/msal-browser` / `@azure/msal-react`, using redirect flow (popup flow was unreliable locally)
- Access tokens acquired via `acquireTokenSilent` and attached as `Authorization: Bearer` headers on every API call
- Role check (`isAdmin`) reads the `roles` claim from the signed-in account's ID token to conditionally show admin-only actions (status updates)

## Types ↔ API DTOs

| TS type | Mirrors (C#) |
|---|---|
| `Claim` | `Models/Claim.cs` |
| `CreateClaimRequest` | `DTOs/CreateClaimRequest.cs` (includes `captchaToken`) |
| `ClaimStatus` | `Models/ClaimStatus.cs` (enum, serialized as string) |

## Environment variables (`.env`, not committed)

```
VITE_AZURE_CLIENT_ID=...
VITE_AZURE_TENANT_ID=...
VITE_RECAPTCHA_SITE_KEY=...
```

## Local setup

1. Requires the [ClaimPortal.Api](../ClaimPortal.Api) backend running (default: `http://localhost:5111`)
2. Requires an Entra ID app registration configured with a Single-page application platform and redirect URI `http://localhost:5173`
3. Create `.env` with the variables above
4. Install dependencies: `npm install`
5. Run dev server: `npm run dev`
6. Open the printed local URL (default: `http://localhost:5173`), log in, and test

API calls are proxied — requests to `/api/*` are forwarded to the backend automatically, see `vite.config.ts`.

## Known limitations

- No visual distinction yet between a claimant's own claims and all claims — all authenticated users currently see the full claims list (mirrors the backend's documented data-isolation gap).
- Form has no client-side validation beyond the reCAPTCHA check (relies on backend validation).

## Status

- [x] Vite + React + TypeScript scaffold
- [x] TypeScript types matching backend DTOs
- [x] Claim list + claim submission form, live data
- [x] Entra ID login/logout (redirect flow)
- [x] Token acquisition + attachment on all API calls
- [x] Role-based UI (Admin-only status update controls)
- [x] reCAPTCHA on claim submission
- [ ] Form validation
- [ ] Accessibility (WCAG) pass
