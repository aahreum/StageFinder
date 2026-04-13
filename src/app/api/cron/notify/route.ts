import { NextRequest, NextResponse } from 'next/server';

// Vercel Cron Jobs가 매일 00:00 UTC(KST 09:00)에 호출하는 엔드포인트
// CRON_SECRET으로 무단 호출 차단
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[cron/notify] CRON_SECRET 환경변수가 설정되지 않았습니다.');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: compare-new-performances, send-email-with-resend 구현 후 연결
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[cron/notify] 처리 중 오류:', err);
    return NextResponse.json({ error: '알 수 없는 오류' }, { status: 500 });
  }
}
