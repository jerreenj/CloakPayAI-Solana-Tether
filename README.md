# CloakPay AI

A local-first QVAC Tether payment firewall for Solana payments — checks invoice risk before a wallet signs, then enables devnet or mainnet-beta SOL transfer when the intent is clear.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cloakpay-ai run dev` — run the frontend (port 26259)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (used by existing db package, not CloakPay itself)
- Optional env: `QVAC_MOCK=0` — enables live local QVAC OCR mode (requires QVAC SDK native bindings)
- Optional env: `SOLANA_DEVNET_RPC`, `SOLANA_MAINNET_RPC` — custom RPC endpoints (defaults to public ones)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + Framer Motion + Lucide + @solana/web3.js
- API: Express 5 + pino logging
- No database — all state is localStorage-only on the frontend
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/cloakpay-ai/src/App.tsx` — main React app (payment firewall UI, all sections)
- `artifacts/cloakpay-ai/src/types.ts` — shared TypeScript types (OCRBlock, PaymentIntent, RiskReport, etc.)
- `artifacts/cloakpay-ai/src/localAnalysis.ts` — browser-side fallback analysis engine
- `artifacts/cloakpay-ai/src/localStore.ts` — localStorage helpers (history, feedback, profile, monitor events)
- `artifacts/cloakpay-ai/src/components/ui/prisma-hero.tsx` — hero section with animated title
- `artifacts/cloakpay-ai/src/index.css` — full custom CSS (no Tailwind components used)
- `artifacts/api-server/src/routes/qvac.ts` — GET /api/qvac/status, POST /api/qvac/analyze-payment
- `artifacts/api-server/src/routes/solana.ts` — POST /api/solana/prepare
- `artifacts/api-server/src/routes/privacy.ts` — POST /api/privacy/receipt

## Architecture decisions

- **No OpenAPI codegen** — CloakPay has a small, stable API surface (4 endpoints). Direct fetch calls from the frontend are simpler and faster to iterate on.
- **localStorage-only state** — No user data leaves the browser except via explicit export. This is intentional for the hackathon privacy-first angle.
- **Dual-mode analysis** — API server runs the risk engine server-side; if unavailable, the frontend falls back to an identical deterministic engine in the browser (`localAnalysis.ts`).
- **QVAC_MOCK gate** — `@qvac/sdk` is marked as an esbuild external and imported dynamically. When `QVAC_MOCK !== "0"`, the server falls back to deterministic block parsing without requiring native bindings.
- **Buffer polyfill** — `@solana/web3.js` uses Node.js `Buffer` in the browser; polyfilled via the `buffer` package in `vite.config.ts`.

## Product

- **Hero** — Animated full-screen video hero with nav links
- **Start Here (Demo)** — Try-without-wallet quick demo, user account, devnet faucet link, feedback links
- **Payment Check (Firewall)** — Upload or paste invoice → OCR/text extraction → risk scoring → intent review → devnet/mainnet SOL signing → privacy receipt
- **Operations (Readiness)** — Mainnet production readiness checklist
- **History** — Local activity history with export
- **Support (Feedback)** — Local feedback inbox, GitHub issue link, email support, event monitor log

## User preferences

- Keep all state local-first (localStorage); no forced backend persistence
- Fallback to browser analysis when API is unavailable (transparent to user)
- Mainnet requires explicit real-funds confirmation before any SOL can move

## Gotchas

- `@qvac/sdk` requires native GPU/Vulkan bindings — it works only when `QVAC_MOCK=0` and the environment has the right native deps. The server falls back gracefully otherwise.
- `@solana/web3.js` needs the `buffer` npm package polyfilled in Vite (see `vite.config.ts`).
- The api-server esbuild build marks `@qvac/sdk` as external so the build doesn't fail when the SDK isn't installed.
- Do NOT add a Vite proxy to reach the API — the shared Replit proxy already routes `/api` to the api-server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Hackathon: Solana/Tether Frontier Hackathon, deadline May 11 2026
- GitHub: https://github.com/jerreenj/CloakPayAI-Solana-Tether
