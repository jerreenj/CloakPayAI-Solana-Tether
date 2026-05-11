export type OCRBlock = {
  text: string;
  bbox?: [number, number, number, number];
  confidence?: number;
};

export type SourceField = {
  field: "recipient" | "amount" | "token" | "memo" | "merchant";
  value: string;
  evidence: string;
  confidence: number;
};

export type PaymentIntent = {
  recipientAddress: string;
  amount: number;
  token: "SOL" | "USDT" | "UNKNOWN";
  memo: string;
  merchant: string;
  confidence: number;
  sourceFields: SourceField[];
  warnings: string[];
};

export type NetworkCluster = "devnet" | "mainnet-beta";

export type RiskReport = {
  score: number;
  verdict: "safe" | "review" | "block";
  warnings: string[];
  explanation: string;
  evidence: string[];
};

export type PrivacyReceipt = {
  invoiceHash: string;
  commitment: string;
  nullifierHash: string;
  stealthLabel: string;
  redactedSummary: string;
  createdAt: string;
  txSignature?: string;
};

export type QvacStats = {
  localOnly: boolean;
  engine: "qvac-ocr" | "deterministic-fallback" | "sample-text";
  ocrModel: string;
  llmModel: string;
  processingMs: number;
};

export type AnalysisResponse = {
  mode: "qvac" | "fallback" | "sample";
  blocks: OCRBlock[];
  intent: PaymentIntent;
  riskReport: RiskReport;
  qvacStats: QvacStats;
};

export type QvacStatus = {
  localOnly: true;
  mode: "live-qvac" | "browser-fallback";
  ocrModel: string;
  llmModel: string;
  paidServices: false;
  notes: string[];
};

export type PreparedTransaction = {
  network: NetworkCluster;
  token?: "SOL" | "USDT";
  kind?: "single" | "batch";
  from: string;
  to: string;
  fromATA?: string;
  toATA?: string;
  mintAddress?: string;
  usdtAmount?: number;
  lamports: number;
  transferCount?: number;
  totalAmount?: number;
  recentBlockhash: string;
  serializedTransaction: string;
  explorerUrl: string;
};

export type LocalHistoryItem = {
  id: string;
  createdAt: string;
  network?: NetworkCluster;
  merchant: string;
  amount: number;
  token: PaymentIntent["token"];
  verdict: RiskReport["verdict"];
  score: number;
  mode: AnalysisResponse["mode"];
  txSignature?: string;
  receiptCommitment?: string;
};

export type FeedbackCategory = "bug" | "wallet" | "invoice" | "risk" | "mainnet" | "other";

export type FeedbackItem = {
  id: string;
  createdAt: string;
  category: FeedbackCategory;
  message: string;
  email?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
};

export type MonitorEvent = {
  id: string;
  createdAt: string;
  level: "info" | "warn" | "error";
  area: "analysis" | "wallet" | "receipt" | "support" | "system";
  message: string;
  network?: NetworkCluster;
};

export type PayrollRecipient = {
  name: string;
  wallet: string;
  amount: number;
  token: "SOL" | "USDT";
};

export type OfflineQueueItem = {
  id: string;
  createdAt: string;
  intent: PaymentIntent;
  riskVerdict?: RiskReport["verdict"];
  receiptCommitment?: string;
  network?: NetworkCluster;
};
