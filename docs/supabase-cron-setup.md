# Supabase Cron Job 설정 가이드

`pg_cron`이 `/api/cron/notify`를 호출하려면 두 가지 값이 필요하다.

- `app.settings.app_url` — 배포된 Next.js 앱의 URL
- `app.settings.cron_secret` — 무단 호출 차단용 시크릿 키

---

## 1. CRON_SECRET 값 준비

`.env.local`에 있는 `CRON_SECRET` 값을 그대로 사용한다.  
없으면 임의의 긴 문자열을 생성한다.

```bash
# 터미널에서 랜덤 시크릿 생성
openssl rand -hex 32
```

Next.js 환경변수(`.env.local` 또는 배포 플랫폼)에도 동일한 값으로 등록한다.

```
CRON_SECRET=여기에_생성한_값
```

---

## 2. Supabase SQL Editor에서 설정

Supabase 대시보드 → **SQL Editor** → **New query**

```sql
-- 앱 URL 설정 (배포 도메인으로 교체)
ALTER DATABASE postgres SET app.settings.app_url = 'https://your-domain.com';

-- cron 시크릿 설정 (.env.local의 CRON_SECRET과 동일한 값으로 교체)
ALTER DATABASE postgres SET app.settings.cron_secret = 'your-secret';
```

**Run** 버튼 클릭 → `ALTER DATABASE` 메시지가 나오면 성공.

> 이 설정은 DB 재시작 후에도 유지된다.

---

## 3. 마이그레이션 적용

cron 스케줄을 DB에 등록한다.

```bash
supabase db push
```

적용 후 스케줄 등록 확인:

```sql
SELECT jobname, schedule, command FROM cron.job;
```

`notify-new-performances` 행이 보이면 성공.

---

## 4. 수동 테스트

pg_net으로 즉시 한 번 호출해 본다.

```sql
SELECT net.http_get(
  url     := current_setting('app.settings.app_url') || '/api/cron/notify',
  headers := jsonb_build_object(
    'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret')
  )
);
```

반환된 `id`로 응답 확인:

```sql
-- id는 위 쿼리 결과값으로 교체
SELECT status, response_status, response_body
FROM net._http_response
WHERE id = 1;
```

`response_status = 200`, `response_body = {"ok":true}` 이면 정상.

---

## 5. 값 변경이 필요할 때

도메인이 바뀌거나 시크릿을 교체할 경우 같은 쿼리를 다시 실행한다.

```sql
ALTER DATABASE postgres SET app.settings.app_url = 'https://new-domain.com';
ALTER DATABASE postgres SET app.settings.cron_secret = 'new-secret';
```

변경 후 DB 연결을 새로 맺어야 반영된다. SQL Editor에서 새 쿼리를 열면 된다.

---

## 흐름 요약

```
Supabase pg_cron (매일 00:00 UTC)
  → pg_net.http_get()
    → /api/cron/notify
      → CRON_SECRET 검증
        → 신규 공연 비교 + 이메일 발송 (구현 예정)
```
