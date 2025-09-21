export async function POST(req: Request) {
  const body = await req.json();
  const { question } = body;

  return new Response(
    JSON.stringify({
      question,
      expert: `專業解釋：這是 ${question} 的嚴謹答案。`,
      simple: `白話解釋：${question} 就像這樣啦～`,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
