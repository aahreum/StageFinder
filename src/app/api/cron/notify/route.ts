import { NextResponse } from 'next/server';

// Vercel Cron Jobs가 매일 오전 9시(UTC)에 호출하는 엔드포인트
// CRON_SECRET으로 무단 호출 차단
export async function GET(req: Request) {
  const secret = req.headers.get('authorization');

  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: compare-new-performances, send-email-with-resend 구현 후 연결
  return NextResponse.json({ ok: true, message: 'cron triggered' });
}
