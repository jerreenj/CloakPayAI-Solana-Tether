import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { NetworkCluster, PaymentIntent } from "./types";

type PrepareRequest = {
  intent: PaymentIntent;
  payer: string;
  network?: NetworkCluster;
};

const endpoints: Record<NetworkCluster, string> = {
  devnet: process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com",
  "mainnet-beta": process.env.SOLANA_MAINNET_RPC || "https://api.mainnet-beta.solana.com"
};

function toPublicKey(value: string, fallback: string) {
  try {
    return new PublicKey(value);
  } catch {
    return new PublicKey(fallback);
  }
}

function getExplorerUrl(kind: "address" | "tx", value: string, network: NetworkCluster) {
  const cluster = network === "devnet" ? "?cluster=devnet" : "";
  return `https://explorer.solana.com/${kind}/${value}${cluster}`;
}

export async function prepareTransfer({ intent, payer, network = "devnet" }: PrepareRequest) {
  if (intent.token === "USDT") {
    throw new Error("USDT is tracked in the payment intent, but CloakPay currently prepares SOL transfers only.");
  }

  const fallbackKey = "11111111111111111111111111111111";
  const connection = new Connection(endpoints[network], "confirmed");
  const fromPubkey = toPublicKey(payer, fallbackKey);
  const toPubkey = toPublicKey(intent.recipientAddress, fallbackKey);
  const lamports = Math.max(1, Math.round(intent.amount * LAMPORTS_PER_SOL));
  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({
    feePayer: fromPubkey,
    recentBlockhash: blockhash
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports
    })
  );

  return {
    network,
    from: fromPubkey.toBase58(),
    to: toPubkey.toBase58(),
    lamports,
    recentBlockhash: transaction.recentBlockhash ?? blockhash,
    serializedTransaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
    explorerUrl: getExplorerUrl("address", toPubkey.toBase58(), network)
  };
}
