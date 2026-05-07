import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

type NetworkCluster = "devnet" | "mainnet-beta";

const endpoints: Record<NetworkCluster, string> = {
  devnet: process.env["SOLANA_DEVNET_RPC"] ?? "https://api.devnet.solana.com",
  "mainnet-beta": process.env["SOLANA_MAINNET_RPC"] ?? "https://api.mainnet-beta.solana.com"
};

function toPublicKey(value: string, fallback: string) {
  try {
    return new PublicKey(value);
  } catch {
    return new PublicKey(fallback);
  }
}

router.post("/solana/prepare", async (req, res) => {
  const { intent, payer, network = "devnet" } = req.body as {
    intent: { recipientAddress: string; amount: number; token: string };
    payer: string;
    network?: NetworkCluster;
  };

  if (intent.token === "USDT") {
    res.status(400).json({ error: "USDT is tracked in the payment intent, but CloakPay currently prepares SOL transfers only." });
    return;
  }

  const fallbackKey = "11111111111111111111111111111111";
  const endpoint = endpoints[network] ?? endpoints["devnet"];
  const connection = new Connection(endpoint, "confirmed");
  const fromPubkey = toPublicKey(payer, fallbackKey);
  const toPubkey = toPublicKey(intent.recipientAddress, fallbackKey);
  const lamports = Math.max(1, Math.round(intent.amount * LAMPORTS_PER_SOL));
  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({ feePayer: fromPubkey, recentBlockhash: blockhash }).add(
    SystemProgram.transfer({ fromPubkey, toPubkey, lamports })
  );

  const cluster = network === "devnet" ? "?cluster=devnet" : "";
  req.log.info({ network, lamports, to: toPubkey.toBase58() }, "solana transfer prepared");

  res.json({
    network,
    from: fromPubkey.toBase58(),
    to: toPubkey.toBase58(),
    lamports,
    recentBlockhash: transaction.recentBlockhash ?? blockhash,
    serializedTransaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
    explorerUrl: `https://explorer.solana.com/address/${toPubkey.toBase58()}${cluster}`
  });
});

export default router;
