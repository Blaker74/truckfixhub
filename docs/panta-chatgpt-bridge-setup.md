# ChatGPT Panta ↔ TruckFixHub Panta bridge

This feature branch adds the Edge Function source and OpenAPI action schema. It does **not** deploy the function or connect a Custom GPT until the setup steps below are completed.

## Architecture
ChatGPT Custom GPT Action → `tfh-panta-bridge` → existing `tfh-openai-panta-gateway` → TruckFixHub verified-knowledge search → answer and retrieval metadata returned to ChatGPT.

## Security setup
1. Generate your own long random bridge key (at least 32 random bytes). Do not put the raw key in GitHub, website JavaScript, chat messages, or a public issue.
2. Compute its SHA-256 hex digest locally. Configure the Supabase Edge Function secret `PANTA_BRIDGE_KEY_SHA256` to that digest.
3. Deploy `supabase/functions/tfh-panta-bridge/index.ts` as Edge Function `tfh-panta-bridge` with JWT verification disabled. The function implements its own API-key authentication, and uses the server-side service-role key only for the server-to-server call to the existing Panta gateway.
4. In ChatGPT, create a Custom GPT, open Actions, import `openapi/panta-bridge.yaml`, choose API Key authentication with a custom header named `x-panta-bridge-key`, and enter the raw key privately in the GPT's authentication setup.
5. Test with a known recall query. Confirm the response includes an answer and nonzero `retrieved_knowledge_count` before treating it as a successful retrieval test.

## Operational safeguards
- Never expose the service-role key to the GPT or browser.
- Rotate the bridge key immediately if exposed; update the hash secret and GPT credential together.
- Limit access to the Custom GPT to its intended users.
- Verify source URLs and evidence quality for technical answers. A model answer by itself is not proof of correctness.
- Monitor Edge Function logs and provider usage to stay within the $25/month budget.
- Add explicit rate limiting and request logging before broad public availability. Do not publish the raw bridge key.
