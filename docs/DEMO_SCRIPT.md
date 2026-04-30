# CloakPay AI Demo Script

## Opening

CloakPay AI is a local-first QVAC payment firewall for Solana payments. It checks private invoices before a wallet signs, so sensitive payment context stays local and the chain only receives the confirmed transaction.

## Walkthrough

1. Open the app and point out the $0 build path: local QVAC/fallback analysis, public Solana devnet RPC, browser/local storage, and no paid services.
2. Run the safe sample invoice and show the extracted merchant, recipient, amount, token, and memo.
3. Show the safe/review/block risk verdict and the evidence behind it.
4. Run the risky sample and show how missing fields, urgency, unknown token, or wallet-verification language changes the verdict.
5. Return to the safe sample, connect a Solana wallet on devnet, prepare the transaction, and sign/send with faucet SOL.
6. Open the devnet explorer link.
7. Create the privacy receipt and show the invoice hash, commitment, nullifier preview, redacted summary, and transaction signature.

## Closing

The invoice stayed local. QVAC/local analysis checked the payment before signing. Solana only received the final devnet payment.

## Vercel Note

The public Vercel page is the preview. The live QVAC OCR story is strongest in the local demo because QVAC is meant to run locally/on-device; the deployed fallback path proves the product flow without paid infrastructure.

## $0 Checklist

- No paid AI API.
- No paid OCR.
- No paid RPC.
- No paid database.
- No paid hosting required.
- No paid assets.
- No mainnet funds.
