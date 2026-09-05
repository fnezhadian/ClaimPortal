# ClaimPortal.Api

ASP.NET Core Web API backend for ClaimPortal, a mini Class Action claims administration system built as a practice project for a Senior Full Stack Application Developer role. Paired with the [client](../client) React frontend.

## Stack

- ASP.NET Core Web API, C#, Entity Framework Core
- SQL Server (SQL Express for local dev)
- Microsoft Entra ID (via Microsoft.Identity.Web) for authentication + role-based authorization
- Google reCAPTCHA v2 (server-side verified) on claim submission
- Built-in ASP.NET Core rate limiting

## Architecture

Follows a lightweight Clean Architecture structure — Controllers and Data are outer, infrastructure-facing layers; Services holds business logic; Models is the core domain layer with no outward dependencies.

![Clean Architecture](docs/architecture.svg)

## Project structure

```
ClaimPortal.Api/
  Controllers/   # HTTP endpoints, thin — delegate to Services
  Services/      # Business logic (ClaimService), reCAPTCHA verification
  Models/        # Domain entities (Claim, Claimant, ClaimStatus)
  DTOs/          # Request/response shapes for the API boundary
  Data/          # EF Core DbContext
  Migrations/    # EF Core schema history
```

## Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/claims` | Authenticated | Submit a new claim (validated, reCAPTCHA-verified, rate-limited) |
| GET | `/api/claims` | Authenticated | List all claims |
| GET | `/api/claims/{id}` | Authenticated | Get a single claim |
| PATCH | `/api/claims/{id}/status` | Admin role only | Update a claim's status |

## Security

- **Authentication**: Microsoft Entra ID (JWT bearer tokens), validated via `Microsoft.Identity.Web`
- **Authorization**: role-based — status updates require the `Admin` app role; all other endpoints require any authenticated user
- **reCAPTCHA**: v2 checkbox on claim submission, verified server-side against Google's `siteverify` endpoint (frontend checkbox alone is not trusted)
- **Input validation**: data annotations on `CreateClaimRequest` (required fields, length limits, amount range)
- **Rate limiting**: fixed-window limiter on claim submission
- **Secrets**: DB connection string and reCAPTCHA secret key stored in user-secrets, never committed; Entra ID client/tenant IDs are non-secret and safely committed in `appsettings.json`
- **CORS**: scoped to the frontend's origin only, not a wildcard

## Known limitations

- Claim-level data isolation is not yet implemented — any authenticated user can currently view any claim via `GET /api/claims` and `GET /api/claims/{id}`. A full implementation would link the Entra ID user's object ID to a `Claimant` record and restrict non-admin users to their own claims.
- No production-safe global exception handler configured yet (`app.UseExceptionHandler`).

## Local setup

1. Requires SQL Server Express (or update the connection string in user-secrets)
2. Requires an Entra ID app registration with an exposed API scope and an `Admin` app role assigned to your test account (see `appsettings.json`'s `AzureAd` section for the expected config shape)
3. Restore packages: `dotnet restore`
4. Apply migrations: `dotnet ef database update`
5. Set secrets: `dotnet user-secrets set "ConnectionStrings:SQLExpressConnection" "..."` and `dotnet user-secrets set "Recaptcha:SecretKey" "..."`
6. Run: `dotnet run`
7. API docs (dev only): `https://localhost:{port}/scalar/v1`

## Status

- [x] Phase 1 — Backend foundation (entities, DbContext, service layer, CRUD endpoints, DTOs)
- [x] Phase 2 — React/Vite/TypeScript frontend
- [x] Phase 3 — Entra ID auth, role-based access, reCAPTCHA, security hardening
- [ ] Phase 4 — Reusable/configurable form components
- [ ] Phase 5 — Accessibility (WCAG) pass
- [ ] Phase 6 — CI/CD, Azure deployment
