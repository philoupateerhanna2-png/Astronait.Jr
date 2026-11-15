// Optional Astro AI route. Deploy as the existing `api` Supabase Edge Function.
// Provider credentials are Edge Function secrets only; never expose them to the browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headersBase = { "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin" };
const approvedSources = [
  { title: "NASA Space Place", url: "https://spaceplace.nasa.gov/" },
  { title: "NASA Science", url: "https://science.nasa.gov/" },
  { title: "NASA Solar System Exploration", url: "https://solarsystem.nasa.gov/" },
  { title: "NASA Learning Resources", url: "https://www.nasa.gov/learning-resources/" }
];
const systemPrompt = `You are Astro, an AI-assisted astronomy learning guide for school-age learners. Be safe, kind, age-appropriate, inclusive and concise. Never claim to be human, a friend, therapist or emergency service. Do not request or retain personal details. Do not provide sexual, self-harm, violent, weapon, drug or other dangerous instructions; refuse briefly and suggest talking to a trusted adult when appropriate. For learning: use short plain-language explanations, one small hint before a full solution when the learner asks for a hint, ask one checking question, and encourage reasoning rather than merely giving answers. Never invent facts or citations. Ground factual astronomy answers only in the approved sources and supplied lesson excerpts. If the sources do not support a claim, say you are unsure and suggest checking with a teacher. Clearly label simplified models and scientific uncertainty. Do not imply the AI replaces teachers or textbooks. Return only JSON: {"answer":"...","sources":[{"title":"...","url":"..."}]}. Sources must be selected only from this list: ${JSON.stringify(approvedSources)}. Keep answer under 120 words.`;

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headersBase, ...extra } });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const allowed = (Deno.env.get("ASTRO_ALLOWED_ORIGINS") || "").split(",").map(x => x.trim()).filter(Boolean);
  const cors = allowed.includes(origin) ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization, content-type, apikey", "Access-Control-Allow-Methods": "POST, OPTIONS" } : {};
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, cors);
  if (!allowed.includes(origin)) return json({ error: "origin_not_allowed" }, 403);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const providerKey = Deno.env.get("AI_PROVIDER_API_KEY");
  const providerUrl = Deno.env.get("AI_PROVIDER_URL");
  const model = Deno.env.get("AI_MODEL");
  if (!supabaseUrl || !anonKey || !providerKey || !providerUrl || !model) return json({ error: "assistant_unavailable" }, 503, cors);

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401, cors);
  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: "unauthorized" }, 401, cors);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > 2500) return json({ error: "payload_too_large" }, 413, cors);
  let body: { message?: unknown; mode?: unknown };
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400, cors); }
  if (typeof body.message !== "string" || body.message.trim().length < 1 || body.message.length > 240 || !["guided", "hint"].includes(String(body.mode || "guided"))) return json({ error: "invalid_request" }, 400, cors);

  // Defense-in-depth request filter. This is not a substitute for a reviewed moderation service.
  const unsafeRequest = /\b(suicid|self.?harm|kill myself|hurt myself|porn|nude|sexual|weapon|gun|bomb|explosive|buy.*drug|how.*get high)\b/i.test(body.message);
  if (unsafeRequest) return json({ answer: "I can’t help with that request. If this is about something happening to you or someone else, please talk with a trusted adult. I can still help with a safe science or space question.", sources: [] }, 200, cors);

  // No prompt history or personal profile is collected or persisted. The user message is processed transiently.
  const userPrompt = `Mode: ${body.mode}. Learner question: ${body.message.trim()}`;
  try {
    const upstream = await fetch(providerUrl, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${providerKey}` },
      body: JSON.stringify({ model, temperature: 0.25, max_tokens: 260, response_format: { type: "json_object" }, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }] }),
      signal: AbortSignal.timeout(8000)
    });
    if (!upstream.ok) return json({ error: "assistant_unavailable" }, 503, cors);
    const result = await upstream.json();
    const raw = result?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw);
    if (typeof parsed.answer !== "string" || parsed.answer.length > 1400) return json({ error: "invalid_provider_response" }, 502, cors);
    const unsafeOutput = /\b(explicit sexual|self.?harm instructions|weapon construction|drug use instructions)\b/i.test(parsed.answer);
    if (unsafeOutput) return json({ answer: "I can’t provide that kind of response. Please ask a trusted adult for help if you are worried, or choose a safe learning question.", sources: [] }, 200, cors);
    const sources = Array.isArray(parsed.sources) ? parsed.sources.filter((source: any) => approvedSources.some(s => s.url === source?.url && s.title === source?.title)).slice(0, 3) : [];
    return json({ answer: parsed.answer.trim(), sources }, 200, cors);
  } catch {
    return json({ error: "assistant_unavailable" }, 503, cors);
  }
});
