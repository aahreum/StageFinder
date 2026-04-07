'use client';

import { useState } from 'react';

interface Props {
  genre: string | null;
  region: string | null;
  keyword: string;
}

// 현재 필터 조건을 이메일과 함께 저장하는 알림 등록 폼
export function SaveUserPreference({ genre, region, keyword }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/user-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, genre, region, keyword: keyword || null }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('success');
      setMessage('알림 등록 완료! 새로운 공연이 생기면 알려드릴게요.');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(data.error ?? '오류가 발생했습니다.');
    }
  };

  return (
    <div className='px-4 py-3 border-b border-border bg-brand/5'>
      <p className='text-xs text-subtle mb-2'>현재 필터 조건으로 신규 공연 알림을 받아보세요.</p>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='이메일 입력'
          required
          disabled={status === 'loading' || status === 'success'}
          className='flex-1 rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-brand disabled:opacity-50'
        />
        <button
          type='submit'
          disabled={status === 'loading' || status === 'success'}
          className='rounded-lg bg-brand px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:opacity-90'
        >
          {status === 'loading' ? '저장 중...' : '알림 받기'}
        </button>
      </form>
      {message && (
        <p className={`mt-1.5 text-xs ${status === 'success' ? 'text-brand' : 'text-error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
