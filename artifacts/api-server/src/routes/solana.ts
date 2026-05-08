import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

type NetworkCluster = "devnet" | "mainnet-beta";

const endpoints: Record<NetworkCluster, string> = {
  devnet: process.env["SOLANA_DEVNET_RPC"] ?? "https://api.devnet.solana.com",
  "mainnet-beta": process.env["SOLANA_MAINNET_RPC"] ?? "https://api.mainnet-beta.solana.com"
};

const USDT_DECIMALS = 6;

const USDT_MINT: Record<NetworkCluster, PublicKey> = {
  devnet: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  "mainnet-beta": new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
};

function toPublicKey(value: string, label: string) {
  try {
    return new PublicKey(value);
  } catch {
    throw new Error(`Invalid ${label} address.`);
  }
}

router.post("/solana/prepare", async (req, res) => {
  const { intent, payer, network = "devnet" } = req.body as {
    intent: { recipientAddress: string; amount: number; token: string };
    payer: string;
    network?: NetworkCluster;
  };

  const cluster = network === "devnet" ? "?cluster=devnet" : "";
  const endpoint = endpoints[network] ?? endpoints["devnet"];
  const connection = new Connection(endpoint, "confirmed");
  let fromPubkey: PublicKey;
  let toPubkey: PublicKey;

  try {
    fromPubkey = toPublicKey(payer, "payer");
    toPubkey = toPublicKey(intent.recipientAddress, "recipient");
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid Solana address."
    });
  }

  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  if (intent.token === "USDT") {
    const mint = USDT_MINT[network];
    const usdtRaw = BigInt(Math.round(intent.amount * 10 ** USDT_DECIMALS));

    const fromATA = getAssociatedTokenAddressSync(
      mint,
      fromPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const toATA = getAssociatedTokenAddressSync(
      mint,
      toPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction({ feePayer: fromPubkey, recentBlockhash: blockhash });

    let needsCreateATA = false;
    try {
      const info = await connection.getAccountInfo(toATA);
      needsCreateATA = !info;
    } catch {
      needsCreateATA = true;
    }

    if (needsCreateATA) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          fromPubkey,
          toATA,
          toPubkey,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    transaction.add(
      createTransferCheckedInstruction(
        fromATA,
        mint,
        toATA,
        fromPubkey,
        usdtRaw,
        USDT_DECIMALS,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    req.log.info(
      { network, usdtAmount: intent.amount, to: toPubkey.toBase58(), token: "USDT", mint: mint.toBase58() },
      "USDT SPL transfer prepared"
    );

    return res.json({
      network,
      token: "USDT",
      from: fromPubkey.toBase58(),
      to: toPubkey.toBase58(),
      fromATA: fromATA.toBase58(),
      toATA: toATA.toBase58(),
      usdtAmount: intent.amount,
      lamports: 0,
      mintAddress: mint.toBase58(),
      recentBlockhash: blockhash,
      serializedTransaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
      explorerUrl: `https://explorer.solana.com/address/${toPubkey.toBase58()}${cluster}`
    });
  }

  const lamports = Math.max(1, Math.round(intent.amount * LAMPORTS_PER_SOL));
  const transaction = new Transaction({ feePayer: fromPubkey, recentBlockhash: blockhash }).add(
    SystemProgram.transfer({ fromPubkey, toPubkey, lamports })
  );

  req.log.info({ network, lamports, to: toPubkey.toBase58(), token: "SOL" }, "SOL transfer prepared");

  return res.json({
    network,
    token: "SOL",
    from: fromPubkey.toBase58(),
    to: toPubkey.toBase58(),
    lamports,
    recentBlockhash: transaction.recentBlockhash ?? blockhash,
    serializedTransaction: transaction.serialize({ requireAllSignatures: false }).toString("base64"),
    explorerUrl: `https://explorer.solana.com/address/${toPubkey.toBase58()}${cluster}`
  });
});

export default router;
