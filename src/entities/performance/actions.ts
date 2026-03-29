'use server';
import { fetchPerformanceDetail } from '@/shared';

/** 공연 ID로 첫 번째 예매처 URL 반환. 없으면 null */
export async function getBookingUrl(id: string): Promise<string | null> {
  const relates = await fetchPerformanceDetail(id);
  return relates[0]?.relateurl ?? null;
}
