# NexVault — Security Policy & Layered Security Model

NexVault is a non-custodial USDX savings protocol. Security is enforced in
defense-in-depth layers — the website, the dApp, and the smart contracts each
carry independent controls so that a failure in one layer does not compromise
user funds.

## Reporting a vulnerability

Report privately via GitHub Security Advisories:

- Contracts: https://github.com/NexVaultGH/nexvault-contracts/security/advisories/new
- Website / dApp: https://github.com/NexVaultGH/nexvault.one/security/advisories/new

Or see https://nexvault.one/.well-known/security.txt

Please do **not** test against live user funds, and do **not** open public
issues for security reports. Good-faith reports are reviewed and credited.

---

## Defense-in-depth layers

### Layer 1 — Transport / Edge (Netlify)
- HTTPS-only, HSTS with `max-age=63072000; includeSubDomains; preload`
- Apex redirect (`www` → apex), 301 forced
- TLS terminated at the Netlify edge; no plaintext origin

### Layer 2 — HTTP security headers (OWASP Secure Headers Project)
Enforced on every response via `_headers` and `netlify.toml`:
- `Content-Security-Policy` — `default-src 'self'`; explicit allowlists for
  scripts (self + cdnjs/jsdelivr), styles, fonts, images (self + data +
  api.qrserver.com), and `connect-src` restricted to Nexus RPC + WalletConnect/
  Reown relays only. `object-src 'none'`, `base-uri 'self'`,
  `frame-ancestors 'none'`, `form-action 'self'`, `upgrade-insecure-requests`.
- `X-Frame-Options: DENY` + `frame-ancestors 'none'` (clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera, microphone, geolocation, payment, usb,
  sensors, and browsing-topics all disabled
- `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`
- `X-Permitted-Cross-Domain-Policies: none`

Known accepted limitation: `script-src` includes `'unsafe-inline'`. The dApp is
a static site with many inline handlers; nonce/hash-based CSP is not feasible
without a server runtime. This is mitigated by SRI (Layer 3), the strict
`connect-src` exfiltration boundary, and the absence of any server-side
templating of user input.

### Layer 3 — Supply chain (Subresource Integrity)
All third-party scripts (ethers.js, qrcodejs) are pinned with
`integrity="sha384-…"` + `crossorigin="anonymous"`. A compromised or swapped
CDN file will be rejected by the browser, not executed.

### Layer 4 — Application / wallet
- Wallet detection uses an **explicit allowlist** (EIP-6963 `io.metamask`,
  `com.coinbase.wallet`) — never a blind `window.ethereum`, defeating wallet
  spoofing.
- WalletConnect sessions are scoped to the Nexus chain only.
- Pre-launch the dashboard is locked; wallet connection is disabled for the
  public and gated behind a private dev key.
- No private keys, seeds, or credentials are ever handled, stored, or
  transmitted by the site. Auth is the wallet signature only.

### Layer 5 — Smart contracts
- Non-upgradeable, no proxy — deployed bytecode is permanent.
- Hardcoded immutable owner; **owner cannot withdraw user principal**
  (reserve-check invariant) and admin functions are bounded.
- No price oracle (fixed APY) and no flash-loan surface (yield = elapsed time).
- `ReentrancyGuard` + Checks-Effects-Interactions on every state-changing call;
  `SafeERC20` for all transfers.
- 258/258 tests passing, 97%+ line coverage; internal CertiK-style audit
  (see `CERTIK-STYLE-AUDIT.md` in the contracts repo) and OWASP Smart
  Contract Top 10 mapping published at https://nexvault.one/security.

---

## OWASP coverage

- **OWASP Web Top 10 (2021)** — mapped to the dApp surface at
  https://nexvault.one/security
- **OWASP Smart Contract Top 10 (2025)** — mapped to the contracts at
  https://nexvault.one/security
- **OWASP Secure Headers Project** — implemented in `_headers` / `netlify.toml`

Last reviewed: 2026-05.
