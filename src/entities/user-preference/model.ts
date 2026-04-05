// user_preferences 테이블 타입
export interface UserPreference {
  id: string;
  email: string;
  genre: string | null;   // KOPIS shcate 코드
  region: string | null;  // KOPIS signgucode
  keyword: string | null; // 공연명 검색 키워드
  created_at: string;
}

// INSERT 시 사용 (id, created_at 제외)
export type UserPreferenceInsert = Omit<UserPreference, 'id' | 'created_at'>;
