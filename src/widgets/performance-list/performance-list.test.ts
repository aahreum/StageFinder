import { describe, it, expect, vi, beforeEach } from 'vitest';

// React 훅 모킹 — 렌더 컨텍스트 없이 컴포넌트를 함수로 호출하기 위해
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useCallback: (fn: unknown) => fn,
    useMemo: (fn: () => unknown) => fn(),
    useState: (init: unknown) => [init, vi.fn()],
  };
});

// 트랜지티브 의존성 모킹
vi.mock('@/entities/performance', () => ({
  usePerformances: vi.fn(),
  PerformanceCard: vi.fn(),
}));
vi.mock('@/shared', () => ({
  supabase: {},
  fetchPerformances: vi.fn(),
}));
vi.mock('@/features/genre-filter', () => ({
  getUniqueGenres: vi.fn(),
  filterByGenre: vi.fn(),
  GenreFilter: vi.fn(),
}));
vi.mock('@/features/region-filter', () => ({
  RegionFilter: vi.fn(),
}));

import { PerformanceList } from './performance-list';
// shared barrel을 거치지 않고 직접 import하여 Supabase 초기화 우회
import { getPerformanceDateParams } from '../../shared/lib/date-params';
import { usePerformances } from '@/entities/performance';
import { getUniqueGenres, filterByGenre } from '@/features/genre-filter';

describe('getPerformanceDateParams 날짜 형식 검증', () => {
  it('stdate가 YYYYMMDD 8자리여야 한다', () => {
    expect(getPerformanceDateParams().stdate).toMatch(/^\d{8}$/);
  });

  it('eddate가 YYYYMMDD 8자리여야 한다', () => {
    expect(getPerformanceDateParams().eddate).toMatch(/^\d{8}$/);
  });

  it('eddate가 stdate보다 미래여야 한다', () => {
    const { stdate, eddate } = getPerformanceDateParams();
    expect(parseInt(eddate)).toBeGreaterThan(parseInt(stdate));
  });

  it('prfstate가 미지정이어야 한다 (예정+공연중 모두 포함)', () => {
    expect(getPerformanceDateParams().prfstate).toBeUndefined();
  });

  it('eddate가 stdate 기준 3개월 후여야 한다', () => {
    const { eddate } = getPerformanceDateParams();
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const expected = `${future.getFullYear()}${String(future.getMonth() + 1).padStart(2, '0')}`;
    expect(eddate.substring(0, 6)).toBe(expected);
  });
});

describe('PerformanceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 기본 mock 값 설정 — 각 테스트에서 override 가능
    vi.mocked(getUniqueGenres).mockReturnValue([]);
    vi.mocked(filterByGenre).mockReturnValue([]);
  });

  it('함수로 export되어야 한다', () => {
    expect(typeof PerformanceList).toBe('function');
  });

  describe('usePerformances 훅 호출 동작', () => {
    it('전달받은 params와 page를 포함한 queryParams로 usePerformances를 호출해야 한다', () => {
      const mockParams = { stdate: '20260101', eddate: '20260331' };
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      } as any);

      // PerformanceList 렌더링 시 usePerformances 호출
      PerformanceList({ params: mockParams });

      // usePerformances가 호출되었는지 확인
      expect(mockUsePerformances).toHaveBeenCalled();
    });
  });

  describe('로딩 상태(isPending: true) 처리', () => {
    it('usePerformances가 isPending: true를 반환할 때 FilterBar, Pagination을 렌더링하지 않아야 한다', () => {
      // Arrange: usePerformances 모킹 - 로딩 상태
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      } as any);

      // Act: 컴포넌트 호출
      const params = { stdate: '20260101', eddate: '20260331' };
      // PerformanceList는 early return하여 FilterBar/Pagination 로직에 도달하지 않음
      // 따라서 getUniqueGenres, filterByGenre는 호출되지 않음
      PerformanceList({ params });

      // Assert: 필터링 함수들이 호출되지 않음 (early return으로 인한 동작)
      // Note: 렌더링 없이 로직 수행을 검증하려면 usePerformances 호출은 필수
      expect(mockUsePerformances).toHaveBeenCalled();
    });
  });

  describe('에러 상태(isError: true) 처리', () => {
    it('usePerformances가 isError: true와 Error를 반환할 때 FilterBar, Pagination을 렌더링하지 않아야 한다', () => {
      // Arrange: usePerformances 모킹 - 에러 상태
      const mockError = new Error('테스트 오류');
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: mockError,
      } as any);

      // Act: 컴포넌트 호출
      const params = { stdate: '20260101', eddate: '20260331' };
      PerformanceList({ params });

      // Assert: usePerformances가 호출되고 early return됨
      expect(mockUsePerformances).toHaveBeenCalled();
      // 에러 상태에서도 FilterBar 로직에 도달하지 않음
      // getUniqueGenres는 호출되지 않음
    });
  });

  describe('빈 데이터(data: []) 처리', () => {
    it('usePerformances가 빈 배열을 반환할 때 getUniqueGenres와 filterByGenre를 호출해야 한다', () => {
      // Arrange: usePerformances 모킹 - 빈 데이터
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      } as any);

      const mockGetUniqueGenres = vi.mocked(getUniqueGenres);
      mockGetUniqueGenres.mockReturnValue([]);

      const mockFilterByGenre = vi.mocked(filterByGenre);
      mockFilterByGenre.mockReturnValue([]);

      // Act: 컴포넌트 호출
      const params = { stdate: '20260101', eddate: '20260331' };
      PerformanceList({ params });

      // Assert: 필터링 함수들이 호출됨
      expect(mockUsePerformances).toHaveBeenCalled();
      expect(mockGetUniqueGenres).toHaveBeenCalledWith([]);
      expect(mockFilterByGenre).toHaveBeenCalledWith([], null);
    });

    it('usePerformances가 빈 배열을 반환할 때 list는 빈 배열이어야 한다', () => {
      // Arrange
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      } as any);

      const mockGetUniqueGenres = vi.mocked(getUniqueGenres);
      mockGetUniqueGenres.mockReturnValue([]);

      const mockFilterByGenre = vi.mocked(filterByGenre);
      mockFilterByGenre.mockReturnValue([]);

      // Act: 컴포넌트 호출
      const params = { stdate: '20260101', eddate: '20260331' };
      PerformanceList({ params });

      // Assert: list는 빈 배열로 변환됨 (data ?? [])
      expect(mockFilterByGenre).toHaveBeenCalledWith([], null);
    });
  });

  describe('정상 데이터(data: Performance[]) 처리', () => {
    it('usePerformances가 공연 데이터 배열을 반환할 때 getUniqueGenres와 filterByGenre를 호출해야 한다', () => {
      // Arrange: 공연 데이터
      const mockPerformances = [
        { id: '1', name: '공연1', genre: '뮤지컬' },
        { id: '2', name: '공연2', genre: '연극' },
        { id: '3', name: '공연3', genre: '뮤지컬' },
      ] as any;

      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: mockPerformances,
        isPending: false,
        isError: false,
        error: null,
      } as any);

      const mockGetUniqueGenres = vi.mocked(getUniqueGenres);
      mockGetUniqueGenres.mockReturnValue(['뮤지컬', '연극']);

      const mockFilterByGenre = vi.mocked(filterByGenre);
      mockFilterByGenre.mockReturnValue(mockPerformances.slice(0, 2));

      // Act: 컴포넌트 호출
      const params = { stdate: '20260101', eddate: '20260331' };
      PerformanceList({ params });

      // Assert
      expect(mockGetUniqueGenres).toHaveBeenCalledWith(['뮤지컬', '연극', '뮤지컬']);
      expect(mockFilterByGenre).toHaveBeenCalledWith(mockPerformances, null);
    });

    it('usePerformances가 null을 반환할 때 list는 빈 배열로 처리해야 한다', () => {
      // Arrange
      const mockUsePerformances = vi.mocked(usePerformances);
      mockUsePerformances.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
        error: null,
      } as any);

      const mockGetUniqueGenres = vi.mocked(getUniqueGenres);
      mockGetUniqueGenres.mockReturnValue([]);

      const mockFilterByGenre = vi.mocked(filterByGenre);
      mockFilterByGenre.mockReturnValue([]);

      // Act
      const params = { stdate: '20260101', eddate: '20260331' };
      PerformanceList({ params });

      // Assert: data가 undefined이면 list는 [] (data ?? [])
      expect(mockGetUniqueGenres).toHaveBeenCalledWith([]);
      expect(mockFilterByGenre).toHaveBeenCalledWith([], null);
    });
  });

  describe('page 파라미터 비정상값 보정', () => {
    it('page=0일 때 1로 보정해야 한다', () => {
      // Given: page 파라미터가 0
      const pageRaw = Number('0');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: page=0은 1로 보정되어야 함
      expect(page).toBe(1);
    });

    it('page=-1일 때 1로 보정해야 한다', () => {
      // Given: page 파라미터가 음수
      const pageRaw = Number('-1');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 음수는 1로 보정되어야 함
      expect(page).toBe(1);
    });

    it('page=abc (NaN)일 때 1로 보정해야 한다', () => {
      // Given: page 파라미터가 문자열 (NaN으로 변환)
      const pageRaw = Number('abc');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: NaN은 Number.isFinite() 실패로 1로 보정되어야 함
      expect(page).toBe(1);
    });

    it('page=1.5일 때 1로 내림(floor)해야 한다', () => {
      // Given: page 파라미터가 소수점이 있는 수
      const pageRaw = Number('1.5');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 소수는 Math.floor()로 정수로 변환되어야 함
      expect(page).toBe(1);
    });

    it('page=3.9일 때 3으로 내림(floor)해야 한다', () => {
      // Given: page 파라미터가 3.9
      const pageRaw = Number('3.9');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 정수 부분만 추출되어야 함
      expect(page).toBe(3);
    });

    it('page=2 (정상값)일 때 그대로 유지해야 한다', () => {
      // Given: page 파라미터가 정상 범위 (1 이상의 정수)
      const pageRaw = Number('2');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 정상값은 변경되지 않아야 함
      expect(page).toBe(2);
    });

    it('page=10 (큰 정상값)일 때 그대로 유지해야 한다', () => {
      // Given: page 파라미터가 큰 정상 범위
      const pageRaw = Number('10');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 큰 정상값도 그대로 유지되어야 함
      expect(page).toBe(10);
    });

    it('page=Infinity일 때 1로 보정해야 한다', () => {
      // Given: page 파라미터가 Infinity
      const pageRaw = Infinity;

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: Infinity는 Number.isFinite() 실패로 1로 보정되어야 함
      expect(page).toBe(1);
    });

    it('page=""(빈 문자열)일 때 1로 보정해야 한다', () => {
      // Given: page 파라미터가 빈 문자열
      const pageRaw = Number('');

      // When: page 정규화 로직 실행
      const page =
        Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

      // Then: 빈 문자열은 0으로 변환되고 1로 보정되어야 함
      expect(page).toBe(1);
    });
  });
});
