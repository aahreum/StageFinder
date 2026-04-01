import type { Coordinates } from '@/shared/types/coordinates';

const EARTH_RADIUS_KM = 6371;

// 두 좌표 간 거리를 km 단위로 반환 (하버사인 공식)
export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  // 부동소수점 오차로 h가 1을 초과하면 Math.asin이 NaN을 반환하므로 클램핑
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(Math.min(1, h)));
}
