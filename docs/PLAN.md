# CloakPay AI Plan

## Summary

CloakPay AI is a private QVAC business operating system for Solana teams. The app keeps sensitive business context local while giving operators four connected workflows: Legal Desk, Offline Merchant, Wallet Lens, and Payroll.

## Product Flow

1. User opens CloakPay AI.
2. User chooses one of four private workflows.
3. QVAC/local analysis turns the business text or uploaded document into structured intent, warnings, evidence, and a trust decision.
4. User reviews the intent locally.
5. User optionally connects a wallet and prepares a real Solana SOL or USDT SPL transaction on devnet or mainnet-beta.
6. CloakPay AI creates a privacy receipt and local history item.
7. Operator can export account, history, monitor, feedback, and receipt data.

## Four Pillars

- Legal Desk: local deal drafting, counterparty review, payment intent, wallet proof, and receipt.
- Offline Merchant: local product/payment receipt workflow for field sales and later sync.
- Wallet Lens: private counterparty review before a deal or payout.
- Payroll: local CSV-style payout validation and batch intent review.

## Product Truth

- The live app is connected and deployed at https://cloakpay-ai.vercel.app.
- SOL and USDT SPL transaction preparation are real on devnet and mainnet-beta.
- USDT escrow release logic and large payroll batching are product direction and should not be represented as audited production smart-contract code yet.
- QVAC/local analysis is the core integration path.
- No paid AI, OCR, RPC, database, or asset service is required.

## Demo Story

Start with: "CloakPay AI is your private business operating system on Solana. Before you deal, agree, sell, or pay people, local AI checks the context privately. Solana only receives the final proof or payment."
