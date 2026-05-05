export default function handler(_request: any, response: any) {
  response.status(200).json({
    ok: true,
    service: "cloakpay-ai",
    networks: ["devnet", "mainnet-beta"],
    mainnetEnabled: true,
    paidServices: false,
    accounts: "wallet-and-local-profile",
    monitoring: "health-endpoint-and-client-event-log",
    support: "in-app-feedback-and-github-issues",
    checkedAt: new Date().toISOString()
  });
}
