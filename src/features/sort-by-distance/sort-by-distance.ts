import type { Performance } from '@/entities/performance';
import type { Coordinates } from '@/shared';
import { haversineDistance } from '@/shared';
import { REGION_COORDS } from '@/shared';

/** 사용자 위치 기준 가까운 순으로 정렬. 좌표 불명 지역은 뒤로 이동 */
export function sortByDistance(
  performances: Performance[],
  userCoords: Coordinates,
): Performance[] {
  return [...performances].sort((a, b) => {
    const coordsA = REGION_COORDS[a.area];
    const coordsB = REGION_COORDS[b.area];

    // 좌표 불명 → 뒤로
    if (!coordsA && !coordsB) return 0;
    if (!coordsA) return 1;
    if (!coordsB) return -1;

    return (
      haversineDistance(userCoords, coordsA) -
      haversineDistance(userCoords, coordsB)
    );
  });
}
