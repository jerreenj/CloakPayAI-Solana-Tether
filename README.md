<div align="center">
  <br />
  <h1>CloakPay AI</h1>
  <p><strong>Your private business operating system on Solana.</strong></p>
  <p>
    One app, four local tools, zero cloud by default. QVAC/local analysis keeps deal, merchant, wallet, and payroll context on-device before anything is signed or settled.
  </p>
  <p>
    <a href="https://cloakpay-ai.vercel.app"><strong>Live App</strong></a>
    ·
    <a href="https://github.com/jerreenj/CloakPayAI-Solana-Tether"><strong>GitHub</strong></a>
    ·
    <a href="docs/DEMO_SCRIPT.md"><strong>Submission Script</strong></a>
    ·
    <a href="docs/SUBMISSION_CHECKLIST.md"><strong>Submission Checklist</strong></a>
  </p>
  <p>
    <img alt="QVAC" src="https://img.shields.io/badge/QVAC-Local_AI-E1E0CC?style=flat-square&labelColor=111111" />
    <img alt="Solana" src="https://img.shields.io/badge/Solana-Mainnet_Ready-14F195?style=flat-square&labelColor=111111" />
    <img alt="USDT" src="https://img.shields.io/badge/USDT-SPL_Transfer-26A17B?style=flat-square&labelColor=111111" />
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&labelColor=111111" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&labelColor=111111" />
  </p>
  <br />
</div>

---

CloakPay AI is a private business OS for Solana operators. It gives a founder, merchant, contractor, or small team one local desk for agreements, receipts, wallet checks, and payroll review. QVAC/local analysis handles the sensitive business context before a wallet signs. Solana receives only the final proof or payment transaction.

The app keeps the name CloakPay AI, but the product story is now broader than a payment firewall: it is the private operating layer before business actions settle on Solana.

## The Four Pillars

| Pillar | What It Does |
| --- | --- |
| Legal Desk | Describe a deal in plain English. CloakPay AI creates a local contract-style payment intent, checks risk, prepares wallet proof, and creates a private receipt. |
| Offline Merchant | Create product lookup, pricing, and receipt context on-device. Export the receipt now and sync settlement when internet and wallet access are available. |
| Wallet Lens | Paste or load wallet context before dealing with someone. CloakPay AI creates a private trust report from the business prompt and public-chain direction. |
| Payroll | Validate team CSV-style payout rows locally, flag issues, build the payment intent, and export payroll proof without sending payroll data to a cloud database. |

## SOL and USDT

CloakPay supports both **SOL** and **Tether (USDT)** transfers on Solana.

When a workflow is denominated in USDT, CloakPay prepares the Solana SPL token transfer so the wallet signs the token, destination, and amount shown in the review screen.

- Mainnet-beta: routes to the real Tether USDT mint (`Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`) after explicit real-funds confirmation.
- Test rail: available for wallet testers who refuse to move funds, using a non-production USDT mint.
- CloakPay never asks for seed phrases and never takes custody.

## What Is Real

- Live app: https://cloakpay-ai.vercel.app.
- Connected API paths: `/api/healthz`, `/api/qvac/status`, `/api/qvac/analyze-payment`, `/api/solana/prepare`, `/api/privacy/receipt`.
- Real Solana transaction preparation for SOL and USDT SPL transfers.
- Mainnet-beta path is available only after explicit real-funds confirmation.
- Wallet signing stays wallet-side.
- Local account, history, feedback, monitor events, and privacy receipts live in browser storage and can be exported as JSON.

## Product Truth

- Legal Desk currently prepares agreement context, wallet proof, payment intent, and receipt. Full automated escrow release logic still needs a dedicated smart contract and audit before broad real-money use.
- Offline Merchant currently creates local receipt/payment context and exportable records. Offline payment sync must be validated under real merchant conditions before production rollout.
- Payroll currently validates and prepares payout intent from local CSV-style input. Large batch settlement needs additional operational safeguards before live payroll use.
- Wallet Lens currently generates private trust/risk context from supplied wallet/business input. Rich chain-history indexing would require an additional data source or local indexer.

## Why This Fits QVAC

QVAC matters because the business context is the product. Contracts, receipts, counterparty review, and payroll files are exactly the kind of data that should stay local.

| Judging Criterion | CloakPay AI Answer |
| --- | --- |
| Technical QVAC depth | Local AI analysis is core to every workflow: Legal, Merchant, Lens, and Payroll. |
| Product value | Small teams can review deals, sales, wallets, and payouts before signing anything. |
| Innovation | Private AI becomes the operating layer before Solana settlement. |
| Demo quality | One polished app, four workflows, connected wallet flow, receipts, exports, and live deployment. |

## Running Locally

Use pnpm. The root package intentionally blocks npm installs so Vercel and local builds use the same workspace lockfile.

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/cloakpay-ai run dev
```

To enable live local QVAC OCR:

```bash
QVAC_MOCK=0 pnpm --filter @workspace/api-server run dev
```

## Submission Links

- Live preview: https://cloakpay-ai.vercel.app
- Public repo: https://github.com/jerreenj/CloakPayAI-Solana-Tether
- Demo script: [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- Submission checklist: [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md)
- QVAC proof plan: [docs/QVAC_PROOF.md](docs/QVAC_PROOF.md)
