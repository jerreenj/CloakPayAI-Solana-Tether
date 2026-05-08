import { Router, type IRouter } from "express";

const router: IRouter = Router();

const fallbackRecipient = "AKYq5mW4TTsz7xyzcoaNiD2VkCfg3eQmQcZkQrzkfVee";
const ocrModelName = "OCR_LATIN_RECOGNIZER_1";
const llmModelName = "deterministic-local-risk-engine";

let ocrModelId: string | undefined;
let qvacLoadError: string | undefined;

type OCRBlock = {
  text: string;
  bbox?: [number, number, number, number];
  confidence?: number;
};

type SourceField = {
  field: "recipient" | "amount" | "token" | "memo" | "merchant";
  value: string;
  evidence: string;
  confidence: number;
};

type PaymentIntent = {
  recipientAddress: string;
  amount: number;
  token: "SOL" | "USDT" | "UNKNOWN";
  memo: string;
  merchant: string;
  confidence: number;
  sourceFields: SourceField[];
  warnings: string[];
};

type RiskReport = {
  score: number;
  verdict: "safe" | "review" | "block";
  warnings: string[];
  explanation: string;
  evidence: string[];
};

function stripDataUrl(image: string) {
  const comma = image.indexOf(",");
  return comma >= 0 ? image.slice(comma + 1) : image;
}

function textToBlocks(text: string): OCRBlock[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ text: line, confidence: 0.96 }));
}

function averageConfidence(blocks: OCRBlock[]) {
  const values = blocks.map((b) => b.confidence).filter((v): v is number => typeof v === "number");
  if (!values.length) return 0.7;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function source(field: SourceField["field"], value: string, evidence: string, confidence = 0.78): SourceField {
  return { field, value, evidence, confidence };
}

function findEvidence(lines: string[], pattern: RegExp) {
  return lines.find((l) => pattern.test(l)) ?? "";
}

function extractField(evidence: string, labels: string[]) {
  if (!evidence) return undefined;
  const escaped = labels.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const match = evidence.match(new RegExp(`\\b(?:${escaped})\\b\\s*:?\\s*(.+)$`, "i"));
  return match?.[1]?.trim();
}

function parseIntent(blocks: OCRBlock[]): PaymentIntent {
  const lines = blocks.map((b) => b.text);
  const text = lines.join("\n");
  const sourceFields: SourceField[] = [];

  const addressEvidence = findEvidence(lines, /(?:recipient|wallet|address|pay to)/i);
  const addressMatch = text.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  const amountEvidence = findEvidence(lines, /\b(?:amount|total|pay|due)\b/i);
  const amountMatch = amountEvidence.match(/\b(?:amount|total|pay|due)\b\s*:?\s*(?:\$|usdt|sol)?\s*([0-9]+(?:\.[0-9]+)?)/i);
  const tokenEvidence = findEvidence(lines, /\b(USDT|SOL)\b/i);
  const tokenMatch = text.match(/\b(USDT|SOL)\b/i);
  const memoEvidence = findEvidence(lines, /\b(?:memo|ref|reference)\b/i) || findEvidence(lines, /\binvoice\b/i);
  const memoValue = extractField(memoEvidence, ["memo", "ref", "reference", "invoice"]);
  const merchantEvidence = findEvidence(lines, /\b(?:merchant|vendor|from|payee)\b/i);
  const merchantValue = extractField(merchantEvidence, ["merchant", "vendor", "from", "payee"]);

  const recipientAddress = addressMatch?.[0] ?? fallbackRecipient;
  const amount = amountMatch ? Number(amountMatch[1]) : 0.25;
  const token = (tokenMatch?.[1]?.toUpperCase() as "SOL" | "USDT" | undefined) ?? "UNKNOWN";
  const memo = memoValue ?? "CloakPay business payment";
  const merchant = merchantValue ?? "Unknown merchant";
  const warnings: string[] = [];

  sourceFields.push(source("recipient", recipientAddress, addressEvidence || "Fallback recipient requires review", addressMatch ? 0.86 : 0.35));
  sourceFields.push(source("amount", String(amount), amountEvidence || "Fallback amount requires review", amountMatch ? 0.88 : 0.4));
  sourceFields.push(source("token", token, tokenEvidence || "No token found", tokenMatch ? 0.9 : 0.35));
  sourceFields.push(source("memo", memo, memoEvidence || "Fallback memo requires review", memoValue ? 0.82 : 0.45));
  sourceFields.push(source("merchant", merchant, merchantEvidence || "No merchant found", merchantValue ? 0.78 : 0.35));

  if (!addressMatch) warnings.push("Recipient address needs manual confirmation.");
  if (!amountMatch) warnings.push("Amount needs manual confirmation.");
  if (!tokenMatch) warnings.push("Token was not found; confirm SOL or USDT before signing.");
  if (!memoValue) warnings.push("Memo was not found; review the fallback memo before signing.");

  return {
    recipientAddress,
    amount,
    token,
    memo,
    merchant,
    confidence: Math.min(0.99, averageConfidence(blocks)),
    sourceFields,
    warnings
  };
}

function buildRiskReport(intent: PaymentIntent, blocks: OCRBlock[]): RiskReport {
  const text = blocks.map((b) => b.text).join(" ").toLowerCase();
  const warnings = [...intent.warnings];
  const evidence: string[] = [];
  let score = 8;

  if (intent.confidence < 0.75) {
    score += 15;
    warnings.push("Low OCR confidence; verify the invoice manually before signing.");
    evidence.push(`Average OCR confidence: ${Math.round(intent.confidence * 100)}%`);
  }

  if ((intent.sourceFields.find((f) => f.field === "recipient")?.confidence ?? 0) < 0.5) {
    score += 30;
    evidence.push("Recipient was not confidently extracted from the document.");
  }

  if ((intent.sourceFields.find((f) => f.field === "amount")?.confidence ?? 0) < 0.5) {
    score += 25;
    evidence.push("Amount was not confidently extracted from the document.");
  }

  if (intent.token === "UNKNOWN") {
    score += 12;
    warnings.push("Payment token is unknown; verify token before signing.");
    evidence.push("Token symbol missing; wallet review must confirm SOL or USDT before signing.");
  }

  if (intent.amount >= 2) {
    score += 14;
    warnings.push("Large amount detected; confirm this is intentional before signing.");
    evidence.push(`Amount parsed as ${intent.amount} ${intent.token === "UNKNOWN" ? "SOL" : intent.token}.`);
  }

  if (/(urgent|immediately|avoid fee|seed phrase|private key|verify wallet|wallet verification|airdrop claim|bonus expires|claim now)/i.test(text)) {
    score += 32;
    warnings.push("Suspicious payment language found.");
    evidence.push("Invoice text contains urgency, wallet-verification, or credential-risk wording.");
  }

  if (/unknown merchant|merchant:\s*unknown|unknown airdrop/i.test(text) || intent.merchant.toLowerCase().includes("unknown")) {
    score += 10;
    warnings.push("Merchant identity looks weak or unknown.");
    evidence.push("Merchant field does not identify a trusted counterparty.");
  }

  if (/(usdt|tether)/i.test(text) && intent.token === "SOL") {
    score += 10;
    warnings.push("Invoice mentions stablecoins but extracted token is SOL.");
    evidence.push("Token wording conflicts with parsed payment token.");
  }

  score = Math.min(100, score);
  const verdict: RiskReport["verdict"] = score >= 70 ? "block" : score >= 32 ? "review" : "safe";

  return {
    score,
    verdict,
    warnings: [...new Set(warnings)],
    explanation:
      verdict === "safe"
        ? "Local analysis found a complete payment intent with no high-risk language."
        : verdict === "review"
          ? "Local analysis found fields or language that should be reviewed before signing."
          : "Local analysis found enough risk to block signing until the invoice is corrected.",
    evidence: evidence.length ? evidence : ["No cloud AI or paid service was used for this analysis."]
  };
}

function fallbackBlocks(fileName: string): OCRBlock[] {
  return [
    { text: "Merchant: Frontier Labs", confidence: 0.93 },
    { text: "Invoice: CLPAY-042", confidence: 0.91 },
    { text: "Amount: 0.25 SOL", confidence: 0.89 },
    { text: `Recipient: ${fallbackRecipient}`, confidence: 0.86 },
    { text: `Memo: ${fileName.replace(/\.[^.]+$/, "")}`, confidence: 0.82 }
  ];
}

async function runQvacOcr(image: string): Promise<OCRBlock[]> {
  // @qvac/sdk is externalized in esbuild and loaded only when QVAC_MOCK=0.
  const { loadModel, ocr, OCR_LATIN_RECOGNIZER_1 } = await import("@qvac/sdk");

  if (!ocrModelId) {
    ocrModelId = await loadModel({
      modelSrc: OCR_LATIN_RECOGNIZER_1,
      modelType: "ocr",
      modelConfig: {
        langList: ["en"],
        useGPU: true,
        timeout: 30000,
        magRatio: 1.5,
        defaultRotationAngles: [90, 180, 270],
        contrastRetry: false,
        lowConfidenceThreshold: 0.5,
        recognizerBatchSize: 1
      }
    });
  }

  const imageBuffer = Buffer.from(stripDataUrl(image), "base64");
  const { blocks } = ocr({
    modelId: ocrModelId,
    image: imageBuffer,
    options: { paragraph: false }
  });
  return await blocks;
}

router.get("/qvac/status", (req, res) => {
  const liveRequested = process.env["QVAC_MOCK"] === "0";
  req.log.info({ liveRequested }, "qvac status");
  res.json({
    localOnly: true,
    mode: liveRequested ? "live-qvac" : "browser-fallback",
    ocrModel: ocrModelId
      ? `${ocrModelName} loaded`
      : liveRequested
        ? `${ocrModelName} will load on first image`
        : "browser fallback mode",
    llmModel: llmModelName,
    paidServices: false,
    notes: [
      "No paid AI APIs, paid OCR, paid RPC, database, or hosting are required.",
      "Set QVAC_MOCK=0 before starting the API to force live local QVAC OCR.",
      qvacLoadError
        ? `Last QVAC load error: ${qvacLoadError}`
        : "Risk analysis is deterministic and local for hosted reliability."
    ]
  });
});

router.post("/qvac/analyze-payment", async (req, res) => {
  const startedAt = Date.now();
  const body = req.body as { image?: string; text?: string; fileName?: string };
  const fileName = body.fileName ?? "invoice";
  let mode: "qvac" | "fallback" | "sample" = "fallback";
  let blocks: OCRBlock[];
  let engine: "qvac-ocr" | "deterministic-fallback" | "sample-text" = "deterministic-fallback";

  if (body.text) {
    mode = "sample";
    engine = "sample-text";
    blocks = textToBlocks(body.text);
  } else if (body.image && process.env["QVAC_MOCK"] === "0") {
    try {
      mode = "qvac";
      engine = "qvac-ocr";
      blocks = await runQvacOcr(body.image);
    } catch (error) {
      qvacLoadError = error instanceof Error ? error.message : "Unknown QVAC error";
      req.log.warn({ err: error }, "qvac ocr failed, falling back to local parser");
      mode = "fallback";
      engine = "deterministic-fallback";
      blocks = fallbackBlocks(fileName);
    }
  } else {
    blocks = fallbackBlocks(fileName);
  }

  const intent = parseIntent(blocks);
  const riskReport = buildRiskReport(intent, blocks);

  req.log.info({ mode, verdict: riskReport.verdict }, "payment analyzed");
  res.json({
    mode,
    blocks,
    intent,
    riskReport,
    qvacStats: {
      localOnly: true,
      engine,
      ocrModel: engine === "qvac-ocr" ? ocrModelName : "not-loaded",
      llmModel: llmModelName,
      processingMs: Date.now() - startedAt
    }
  });
});

export default router;
