// app/api/answer/route.ts
export const dynamic = 'force-dynamic'; // 確保不被靜態化

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  // 回傳 build 資訊，幫你確認部署是否更新
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local";
  return new Response(
    JSON.stringify({
      ok: true,
      howToUse: "POST { question } 到 /api/answer 取得專業/白話解釋",
      example: { question: "什麼是紅血球？" },
      build: sha
    }),
    { headers: { "content-type": "application/json", ...corsHeaders } }
  );
}

export async function POST(req: Request) {
  const { question } = await req.json();
  return new Response(
    JSON.stringify({
      question,
      expert: `專業解釋：這是「${question}」的嚴謹答案。`,
      simple: `白話解釋：${question} 可以這樣理解……`,
    }),
    { headers: { "content-type": "application/json", ...corsHeaders } }
  );
}


