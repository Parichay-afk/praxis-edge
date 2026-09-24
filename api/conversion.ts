/* ── OPENAI CONVERSIONS API (server-side) ──
   Forwards a conversion to https://bzr.openai.com/v1/events.

   This is NOT the browser pixel. The pixel (see src/layouts/Layout.astro)
   posts to /v1/sdk/events with only the public pixel id. This endpoint uses
   a secret service-account key and therefore has to run server-side, which
   is why it lives in api/ as a Vercel Function rather than in the static
   Astro build.

   Required env var (set in the Vercel dashboard, never committed):
     OAI_PIXEL_API_KEY

   Usage:
     POST /api/conversion
     { "type": "lead_created", "sourceUrl": "https://…", "eventId": "…",
       "validateOnly": true }

   `validateOnly` asks OpenAI to check the payload without recording it —
   use it to confirm the key and shape before sending real data. */

const PIXEL_ID = 'BVfzGdKfK2GZJ47JaUifNX'; // public; mirrors site.oaiPixelId
const ENDPOINT = `https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`;
const ALLOWED_ORIGINS = [
  'https://www.praxis-edge.com',
  'https://praxis-edge.com',
  'http://localhost:4321',
];

/* Each event type has a fixed data.type, taken from the oaiq SDK's own
   mapping. Sending a mismatched pair gets the event dropped. */
const DATA_TYPE: Record<string, string> = {
  page_viewed: 'contents',
  items_added: 'contents',
  order_created: 'contents',
  lead_created: 'customer_action',
  registration_completed: 'customer_action',
  subscription_created: 'plan_enrollment',
  custom: 'custom',
};

/* Minimal shapes — avoids pulling in @vercel/node just for types. */
type Req = {
  method?: string;
  body?: Record<string, unknown> | string | null;
  headers: Record<string, string | string[] | undefined>;
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OAI_PIXEL_API_KEY;
  if (!apiKey) {
    // Deployed but not configured yet — say so plainly rather than 500ing.
    return res.status(503).json({ error: 'OAI_PIXEL_API_KEY is not set' });
  }

  // Cheap abuse guard. A browser always sends Origin on a cross-origin POST;
  // server-to-server callers send none, which we allow.
  const origin = req.headers.origin;
  if (typeof origin === 'string' && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) ?? {};
  const type = String((body as Record<string, unknown>).type ?? 'page_viewed');
  const dataType = DATA_TYPE[type];
  if (!dataType) {
    return res.status(400).json({ error: `Unsupported event type: ${type}` });
  }

  const b = body as Record<string, unknown>;
  const event = {
    // Caller-supplied id lets a browser-pixel event and this server event be
    // deduplicated against each other. Otherwise the same conversion counts twice.
    id: typeof b.eventId === 'string' && b.eventId ? b.eventId : crypto.randomUUID(),
    type,
    timestamp_ms: Date.now(),
    source_url: typeof b.sourceUrl === 'string' ? b.sourceUrl : 'https://www.praxis-edge.com/',
    action_source: 'web',
    data: { type: dataType },
  };

  try {
    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ validate_only: b.validateOnly === true, events: [event] }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // Never echo the upstream body verbatim to the caller — log it instead.
      console.error('[conversion] upstream %d: %s', upstream.status, text);
      return res.status(502).json({ error: 'Upstream rejected the event' });
    }

    return res.status(200).json({ ok: true, eventId: event.id, validateOnly: b.validateOnly === true });
  } catch (err) {
    console.error('[conversion] request failed', err);
    return res.status(502).json({ error: 'Could not reach the events API' });
  }
}

function safeParse(s: string): Record<string, unknown> | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
