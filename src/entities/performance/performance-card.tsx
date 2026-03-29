'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Performance } from './model';
import { getBookingUrl } from './actions';

// 공연 상태별 배지 색상 (테스트에서 import 가능하도록 export)
export const STATUS_COLOR: Record<Performance["status"], string> = {
  공연예정: "bg-warning/10 text-warning",
  공연중: "bg-success/10 text-success",
  공연완료: "bg-subtle/10 text-subtle",
};

interface Props {
  performance: Performance;
}

export function PerformanceCard({ performance }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    id,
    title,
    poster,
    venue,
    area,
    genre,
    startDate,
    endDate,
    status,
    isOpenRun,
  } = performance;

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const url = await getBookingUrl(id);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${title} 예매처 보기`}
      aria-busy={loading}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className={`flex gap-3 rounded-xl border border-border bg-background p-3 transition-opacity ${loading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:border-brand'} focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2`}
    >
      {/* 포스터 */}
      <div className='relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-border'>
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            className='object-cover'
            sizes='80px'
            loading='eager'
          />
        ) : (
          <div className='h-full w-full' />
        )}
      </div>

      {/* 정보 */}
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        {/* 장르 + 상태 */}
        <div className='flex items-center gap-1.5'>
          <span className='text-xs text-subtle'>{genre}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_COLOR[status]}`}>
            {isOpenRun ? '오픈런' : status}
          </span>
        </div>

        {/* 제목 */}
        <p className='truncate font-semibold leading-snug'>{title}</p>

        {/* 공연장 */}
        <p className='truncate text-sm text-subtle'>{venue}</p>

        {/* 날짜 · 지역 */}
        <p className='mt-auto text-xs text-subtle'>
          {startDate} ~ {endDate} · {area}
        </p>
      </div>
    </article>
  );
}
