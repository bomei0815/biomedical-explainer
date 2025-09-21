export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: ... }), {
    headers: { 'content-type': 'application/json' },
  });
}
export async function POST(req: Request) {
  const { question } = await req.json();

  // TODO: 之後接 Gemini API
  return new Response(
    JSON.stringify({
      professional: `專業解釋：這是「${question}」的專業版回答。`,
      simple: `白話解釋：這是「${question}」的簡單版回答。`,
    }),
    { headers: { "content-type": "application/json" } }
  );
}


