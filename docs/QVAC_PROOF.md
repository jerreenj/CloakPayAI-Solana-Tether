# QVAC Proof

## Core Claim

CloakPay AI uses QVAC/local analysis as the first step in every business workflow. Sensitive legal, merchant, wallet, and payroll context is analyzed locally before the wallet prepares or signs a Solana transaction.

## Where QVAC Fits

- Legal Desk: extracts deal/payment intent, warnings, evidence, and a receipt from private deal text.
- Offline Merchant: turns sale context into a local payment intent and queueable receipt.
- Wallet Lens: turns wallet/business context into a local trust report before a deal.
- Payroll: turns CSV-style payout rows into local validation, risk context, and batch preparation.

## Demo Evidence

- `/api/qvac/status` exposes the current QVAC/local mode.
- `/api/qvac/analyze-payment` runs the analysis path used by all four workflows.
- Browser fallback mode is clearly labeled for hosted preview reliability.
- No OpenAI, Anthropic, paid OCR, paid hosted inference, paid database, or paid RPC is required.

## Settlement Evidence

- `/api/solana/prepare` prepares real SOL and USDT SPL transactions.
- `/api/solana/prepare-batch` prepares same-token payroll batch transactions.
- Mainnet-beta USDT uses the real Tether mint: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`.
- Wallet signing stays with the user wallet. CloakPay AI never asks for seed phrases and never takes custody.
