export async function GET() {
  return new Response(JSON.stringify({ ok: true,
      ts: Date.now(),via: 'app-router'  }), {
    headers: { 'content-type': 'application/json' },
  });
}
