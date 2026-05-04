import { createPrivacyReceipt } from "../../server/privacy.js";

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed.");
    return;
  }

  try {
    response.status(200).json(await createPrivacyReceipt(request.body));
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : "Receipt generation failed.");
  }
}
