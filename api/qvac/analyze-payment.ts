import { analyzePayment } from "../../server/qvac.js";

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed.");
    return;
  }

  try {
    const { image, text, fileName } = request.body as { image?: string; text?: string; fileName?: string };
    if (!image && !text) {
      response.status(400).send("Missing image or text payload.");
      return;
    }

    response.status(200).json(await analyzePayment({ image, text, fileName: fileName ?? "payment-input" }));
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : "Analysis failed.");
  }
}
