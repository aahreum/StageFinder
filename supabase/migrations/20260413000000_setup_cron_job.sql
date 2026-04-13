-- pg_cron: 스케줄 실행 / pg_net: HTTP 호출
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 앱 URL과 cron 시크릿은 DB 설정값으로 주입
-- 배포 후 아래 명령어로 값 설정 필요:
--   ALTER DATABASE postgres SET app.settings.app_url = 'https://your-domain.com';
--   ALTER DATABASE postgres SET app.settings.cron_secret = 'your-secret';

-- 기존 스케줄 중복 방지 후 등록
SELECT cron.unschedule('notify-new-performances') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'notify-new-performances'
);

SELECT cron.schedule(
  'notify-new-performances',
  '0 0 * * *', -- 매일 00:00 UTC (KST 09:00)
  $$
  SELECT net.http_get(
    url     := current_setting('app.settings.app_url') || '/api/cron/notify',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret')
    )
  );
  $$
);
