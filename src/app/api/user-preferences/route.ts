import { supabase } from '@/shared';
import { NextResponse } from 'next/server';
import type { UserPreferenceInsert } from '@/entities/user-preference';

export async function POST(req: Request) {
  const body: UserPreferenceInsert = await req.json();

  if (!body.email || !body.email.includes('@')) {
    return NextResponse.json({ error: '유효한 이메일을 입력해주세요.' }, { status: 400 });
  }

  const { error } = await supabase.from('user_preferences').insert(body);

  if (error) {
    // 이메일 중복 (unique constraint)
    if (error.code === '23505') {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
