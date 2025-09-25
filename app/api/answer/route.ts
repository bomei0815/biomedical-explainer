// app/api/answer/route.ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 開放所有來源（可改成限定網域）
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // 處理 CORS 預檢請求
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      howToUse: "POST { question } 到 /api/answer 取得專業/白話解釋",
      example: { question: "什麼是紅血球？" },
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

