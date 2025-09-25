// app/api/answer/route.ts
export const dynamic = 'force-dynamic';

// ---- CORS ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ---- 回覆 helpers：統一格式 ----
function jsonResponse(
  data: unknown,
  init: ResponseInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...(init.headers || {}),
    },
  });
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>
): Response {
  return jsonResponse({ ok: false, error: { code, message }, ...extra }, { status });
}

// ---- OPTIONS (CORS preflight) ----
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// ---- GET（健康檢查 / 使用說明）----
export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local';
  return jsonResponse({
    ok: true,
    howToUse: 'POST { question } 到 /api/answer 取得專業/白話解釋',
    example: { question: '什麼是紅血球？' },
    build: sha,
  });
}

// ---- POST（主功能）----
export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    // 1) 檢查 Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return errorResponse(415, 'UNSUPPORTED_MEDIA_TYPE', 'Content-Type 必須為 application/json');
    }

    // 2) 嘗試解析 JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse(400, 'INVALID_JSON', 'Body 不是合法 JSON');
    }

    // 3) 驗證欄位
    const question = (body as any)?.question;
    if (typeof question !== 'string') {
      return errorResponse(400, 'MISSING_FIELD', '需要欄位 question (string)');
    }

    const q = question.trim();
    if (!q) {
      return errorResponse(400, 'EMPTY_QUESTION', 'question 不可為空字串');
    }
    if (q.length > 200) {
      return errorResponse(413, 'QUESTION_TOO_LONG', 'question 長度不可超過 200 字', { max: 200, length: q.length });
    }

    // 4) —— 這裡將來接 LLM / 知識庫（現在先回示範文字）——
    const expert = `專業解釋：這是「${q}」的嚴謹答案。`;
    const simple = `白話解釋：${q} 可以這樣理解……`;

    // 5) 基本日誌（在 Vercel Runtime Logs 可見）
    console.log('[answer.success]', { requestId, length: q.length });

    return jsonResponse({ ok: true, question: q, expert, simple });
  } catch (err: any) {
    console.error('[answer.error]', { requestId, message: err?.message, stack: err?.stack });
    return errorResponse(500, 'INTERNAL_ERROR', '伺服器發生未預期的錯誤');
  }
}
