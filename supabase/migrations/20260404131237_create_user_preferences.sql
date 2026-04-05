-- 알림 조건 저장 테이블
-- 사용자가 원하는 공연 조건을 저장하고 신규 공연 발생 시 이메일 발송에 사용
CREATE TABLE IF NOT EXISTS user_preferences (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL,
  genre      TEXT,                        -- KOPIS shcate 코드 (예: GGGA)
  region     TEXT,                        -- KOPIS signgucode (예: 11)
  keyword    TEXT,                        -- 공연명 검색 키워드
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 이메일 기준 중복 등록 방지
CREATE UNIQUE INDEX IF NOT EXISTS user_preferences_email_idx ON user_preferences (email);

-- RLS 활성화 (향후 인증 연동 대비)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 공개 insert/select 허용 (인증 미구현 단계)
CREATE POLICY "public insert" ON user_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "public select" ON user_preferences FOR SELECT USING (true);
