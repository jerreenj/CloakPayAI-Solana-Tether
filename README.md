# CloakPay AI

**Scan any invoice. Score the risk. Sign only when it's safe.**

CloakPay AI is a payment firewall for the Solana ecosystem — powered by QVAC, Tether's local-first AI platform. Before your wallet ever signs anything, CloakPay reads the invoice on your device, extracts what you're actually being asked to pay, and scores the risk. Your invoice data never leaves your device.

---

## What happens when you use it

1. **Drop in any invoice** — Upload an image or paste raw text
2. **QVAC reads it locally** — On-device OCR extracts the merchant name, amount, recipient wallet, token type, and memo — each with a confidence score
3. **You see the risk verdict** — The risk engine scores the payment and flags suspicious patterns before you see the sign button
4. **You review and approve** — Every extracted field is editable before anything is signed
5. **Your wallet signs** — Only then does Phantom (or any Solana wallet) get asked for a signature
6. **You get a privacy receipt** — A cryptographic proof of what was verified, stored only in your browser

---

## SOL and USDT

CloakPay supports both **SOL** and **Tether (USDT)** transfers on Solana.

When your invoice is denominated in USDT, CloakPay builds the correct Solana SPL token transfer — so your wallet signs exactly what the invoice shows, with no manual address copying or amount transcription. The full token account setup is handled automatically.

- Devnet: uses a demo USDT token for safe testing
- Mainnet: routes to the real Tether USDT contract (`Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`)

---

## Powered by QVAC — Local AI, No Cloud

Most AI tools send your documents to a cloud server. QVAC runs entirely on your device — no API key, no subscription, no data leaving your machine. For payment invoices, which often contain sensitive vendor and financial information, this is exactly the right architecture.

**What QVAC does inside CloakPay:**

- Reads invoice images using on-device OCR (`@qvac/ocr-onnx`)
- Extracts each payment field with an individual confidence score
- Flags low-confidence extractions before you sign anything
- Works entirely offline — the AI engine makes no network calls

The QVAC Analysis panel in the firewall shows you every OCR block that was extracted, each field's confidence score as a visual bar, and exactly what evidence was used to build the risk verdict.

---

## Privacy by design

- All history, receipts, and account data live in your browser only
- Export your history as a JSON file at any time
- Nothing is sent to any server except the Solana RPC when confirming a transaction
- The privacy receipt uses SHA-256 commitment + nullifier — the same cryptographic tooling as zero-knowledge proofs

---

## Try it now

No wallet needed. Click **Try Without Wallet** for a 30-second demo of the full firewall flow.

Three sample invoices are built in:
- **Safe SOL** — a clean Solana SOL payment, scores safe
- **Safe USDT** — a clean Tether USDT payment, shows the full SPL token flow
- **Risky Sample** — urgency language, missing fields, scores as block

For real devnet signing: [Get Devnet SOL →](https://faucet.solana.com/)

---

## Running locally

```
pnpm install
pnpm --filter @workspace/api-server run dev   # API server on port 8080
pnpm --filter @workspace/cloakpay-ai run dev  # Frontend on port 26259
```

To enable live QVAC OCR (requires local GPU/Vulkan bindings):
```
QVAC_MOCK=0 pnpm --filter @workspace/api-server run dev
```

---

## Links

- [GitHub](https://github.com/jerreenj/CloakPayAI-Solana-Tether)
- [QVAC by Tether](https://qvac.tether.io)
- [QVAC Docs](https://docs.qvac.tether.io)
- [Solana Devnet Faucet](https://faucet.solana.com/)
- [Submit feedback or report a bug](https://github.com/jerreenj/CloakPayAI-Solana-Tether/issues/new)

---

*Built for the Solana / Tether Frontier Hackathon — May 2026*
