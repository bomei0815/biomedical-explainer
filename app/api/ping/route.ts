export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: ... }), {
    headers: { 'content-type': 'application/json' },
  });
}
