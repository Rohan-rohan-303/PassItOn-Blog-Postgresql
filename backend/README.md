Deployment / Render notes

Problem addressed
- Some deployments (Render, some cloud environments) prefer IPv6 DNS records which can lead to "ENETUNREACH" / "ETIMEDOUT" when the host's IPv6 route is not available.

Quick fix (recommended)
- In your Render service settings, add the following environment variable:

  Name: NODE_OPTIONS
  Value: --dns-result-order=ipv4first

- Redeploy the service after adding the variable.

Why this helps
- Forces Node's DNS resolver to prefer IPv4 A records over AAAA (IPv6) records. The repository already includes a safety `dns.setDefaultResultOrder('ipv4first')` in `backend/config/db.ts`, but the environment-level NODE_OPTIONS is a good safety-net for older Node versions on Render.

Code change included
- `backend/config/db.ts` now includes:
  - ipv4-first DNS preference (safe no-op on older Node)
  - a `query` wrapper with retry + exponential backoff for transient DB/network errors
  - a `checkConnection` helper for health checks

Next steps / suggestions
- Add a `/health` endpoint that calls `checkConnection()` and returns HTTP 200/5xx for service monitoring.
- If problems persist, check Supabase/DB network allowlist and SSL settings (make sure the DB allows connections from Render).