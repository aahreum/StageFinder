"use client";

import { useState, useMemo, useEffect } from "react";
import {
  usePerformances,
  PerformanceCard,
  type Performance,
} from "@/entities/performance";
import {
  GenreFilter,
  GENRE_TO_SLUG,
  GENRE_TO_KOPIS_CODE,
} from "@/features/genre-filter";
import { RegionFilter } from "@/features/region-filter";
import { DateFilter, getDateRangeParams, type DateRange } from "@/features/date-filter";
import { SearchInput } from "@/features/search-input";
import { useUserLocation } from "@/features/user-location";
import { sortByDistance } from "@/features/sort-by-distance";
import { filterBtnClass } from "@/shared/ui/button-class";
import { haversineDistance, REGION_COORDS } from "@/shared";
import type { FetchPerformancesParams } from "@/shared";

// region이 바뀌어도 항상 고정 표시할 장르 목록
const FIXED_GENRES = Object.keys(GENRE_TO_SLUG);

const PAGE_SIZE = 20;

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortNear, setSortNear] = useState(false);
  // 위치 조회 중 정렬 대기 상태 (조회 완료 후 자동 활성화)
  const [sortPending, setSortPending] = useState(false);
  const { location, address, isLoading: locationLoading, error: locationError, getLocation } = useUserLocation();

  // 위치 조회 완료 → 정렬 활성화
  useEffect(() => {
    if (sortPending && location) {
      setSortNear(true);
      setSortPending(false);
    }
  }, [sortPending, location]);

  // 위치 조회 실패 → 대기 해제
  useEffect(() => {
    if (sortPending && locationError) {
      setSortPending(false);
    }
  }, [sortPending, locationError]);

  const handleSortToggle = () => {
    if (sortNear) {
      setSortNear(false);
      return;
    }
    if (location) {
      setSortNear(true);
    } else {
      // 위치 없으면 조회 요청 후 완료 시 자동 활성화
      getLocation();
      setSortPending(true);
    }
  };

  const queryParams = useMemo(
    () => ({
      ...params,
      // 날짜 범위 선택 시 base params의 stdate/eddate를 덮어씀
      ...(selectedDateRange && getDateRangeParams(selectedDateRange)),
      cpage: page,
      rows: PAGE_SIZE,
      ...(selectedRegion && { signgucode: selectedRegion }),
      // 장르 필터를 서버사이드로 전달 (클라이언트 필터링 대신 KOPIS shcate 사용)
      ...(selectedGenre && { shcate: GENRE_TO_KOPIS_CODE[selectedGenre] }),
      // 공연명 검색 (엔터 입력 시 확정)
      ...(searchQuery && { shprfnm: searchQuery }),
    }),
    [params, page, selectedRegion, selectedGenre, selectedDateRange, searchQuery],
  );

  const { data, isPending, error, isError } = usePerformances(queryParams);

  const list = useMemo<Performance[]>(() => {
    const base = data ?? [];
    if (sortNear && location) return sortByDistance(base, location);
    return base;
  }, [data, sortNear, location]);

  // 가까운 순 활성 시 각 공연의 거리(km) 계산
  const distanceMap = useMemo<Record<string, number>>(() => {
    if (!sortNear || !location) return {};
    return Object.fromEntries(
      list
        .map((p) => {
          const coords = REGION_COORDS[p.area];
          return coords ? [p.id, haversineDistance(location, coords)] : null;
        })
        .filter((entry): entry is [string, number] => entry !== null),
    );
  }, [list, sortNear, location]);

  // 리스트 영역 렌더링 (필터 UI는 항상 마운트 유지)
  const renderList = () => {
    if (isPending) {
      return (
        <div className="flex flex-1 items-center justify-center text-subtle">
          불러오는 중...
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-1 items-center justify-center text-error">
          오류가 발생했습니다: {error.message}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center text-subtle">
          공연 정보가 없습니다.
        </div>
      );
    }
    return (
      <ul className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((performance) => (
          <li key={performance.id}>
            <PerformanceCard
              performance={performance}
              distance={distanceMap[performance.id]}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <SearchInput onSearch={(q) => { setSearchQuery(q); setPage(1); }} />
      <DateFilter
        selected={selectedDateRange}
        onChange={(range) => {
          setSelectedDateRange(range);
          setPage(1);
        }}
      />
      <RegionFilter
        selected={selectedRegion}
        onChange={(code) => {
          setSelectedRegion(code);
          setPage(1);
        }}
      />
      <GenreFilter
        genres={FIXED_GENRES}
        selected={selectedGenre}
        onChange={(genre) => {
          setSelectedGenre(genre);
          setPage(1);
        }}
      />

      {/* 가까운 순 정렬 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <button
          type="button"
          onClick={handleSortToggle}
          disabled={locationLoading || sortPending}
          className={filterBtnClass(sortNear)}
        >
          {locationLoading || sortPending ? '위치 조회 중...' : '가까운 순'}
        </button>
        {/* 현재 위치 표시 */}
        {address && (
          <span className="text-xs text-subtle">📍 {address}</span>
        )}
        {locationError && (
          <span className="text-xs text-error">{locationError}</span>
        )}
      </div>

      {renderList()}

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-4 border-t border-border py-4">
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 enabled:hover:border-brand enabled:hover:text-brand"
        >
          이전
        </button>
        <span className="text-sm text-subtle">{page} 페이지</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={list.length < PAGE_SIZE}
          className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 enabled:hover:border-brand enabled:hover:text-brand"
        >
          다음
        </button>
      </div>
    </div>
  );
}
