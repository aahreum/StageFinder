# KOPIS 공개 API 스펙 정리

> 공연예술통합전산망(KOPIS: Korea Performing Arts Box Office Information System)
> 운영: 예술경영지원센터
> 공식 문서: https://kopis.or.kr/por/cs/openapi/openApiInfo.do?menuId=MNU_00074
> 실제 API 호출 및 응답 분석을 통해 작성됨 (2026-03-28)

---

## 인증 방식

모든 요청에 쿼리 파라미터 `service`로 API 키를 전달합니다.

```
?service={API_KEY}
```

환경 변수 키 이름: `KOPIS_API_KEY` (`.env.local` 관리)

---

## 베이스 URL

```
https://kopis.or.kr/openApi/restful
```

> `www.kopis.or.kr`로 요청 시 301 리다이렉트가 발생하므로, `kopis.or.kr`을 직접 사용합니다.

---

## 1. 공연 목록 조회

### 엔드포인트

```
GET /pblprfr
```

### 요청 파라미터

| 파라미터 | 필수 | 설명 | 예시 |
|---|---|---|---|
| `service` | Y | API 인증키 | `1102c29dc...` |
| `stdate` | Y | 공연 시작일 (YYYYMMDD) | `20250301` |
| `eddate` | Y | 공연 종료일 (YYYYMMDD) | `20250331` |
| `cpage` | Y | 현재 페이지 번호 | `1` |
| `rows` | Y | 페이지당 결과 수 | `10` |
| `shprfnm` | N | 공연명 검색 키워드 | `오페라` |
| `signgucode` | N | 지역 코드 (행정구역 코드 앞 2자리) | `11` (서울) |
| `signgucodesub` | N | 시군구 코드 | - |
| `shgenrenm` | N | 장르 코드 (아래 코드표 참조) | `GGGA` |
| `prfstate` | N | 공연 상태 코드 (아래 코드표 참조) | `02` |
| `openrun` | N | 오픈런 여부 (`Y`/`N`) | `Y` |
| `kidstate` | N | 어린이 공연 여부 (`Y`/`N`) | `Y` |
| `shcaf` | N | 공연시설 특성 코드 | - |
| `shprfnmfct` | N | 공연시설명 검색 키워드 | `국립극장` |

### 요청 예시

```
GET https://kopis.or.kr/openApi/restful/pblprfr
  ?service={API_KEY}
  &stdate=20250301
  &eddate=20250331
  &cpage=1
  &rows=10
  &signgucode=11
  &prfstate=02
```

### XML 응답 구조

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<dbs>
  <db>
    <mt20id>PF279014</mt20id>         <!-- 공연 ID (상세 조회 키) -->
    <prfnm>영유클래식</prfnm>           <!-- 공연명 -->
    <prfpdfrom>2025.01.11</prfpdfrom> <!-- 공연 시작일 (YYYY.MM.DD) -->
    <prfpdto>2026.06.28</prfpdto>     <!-- 공연 종료일 (YYYY.MM.DD) -->
    <fcltynm>온쉼표</fcltynm>          <!-- 공연시설명 -->
    <poster>http://www.kopis.or.kr/upload/pfmPoster/...</poster> <!-- 포스터 이미지 URL -->
    <area>서울특별시</area>             <!-- 지역명 -->
    <genrenm>서양음악(클래식)</genrenm> <!-- 장르명 -->
    <openrun>N</openrun>              <!-- 오픈런 여부 (Y/N) -->
    <prfstate>공연중</prfstate>        <!-- 공연 상태 -->
  </db>
  <!-- ... -->
</dbs>
```

### 공연 목록 응답 필드 설명

| 필드명 | 설명 | 비고 |
|---|---|---|
| `mt20id` | 공연 고유 ID | 상세 조회 시 사용 |
| `prfnm` | 공연명 | - |
| `prfpdfrom` | 공연 시작일 | `YYYY.MM.DD` 형식 |
| `prfpdto` | 공연 종료일 | `YYYY.MM.DD` 형식 |
| `fcltynm` | 공연시설명 | - |
| `poster` | 포스터 이미지 URL | 절대 경로 |
| `area` | 지역명 | 시도 단위 |
| `genrenm` | 장르명 | 아래 장르 목록 참조 |
| `openrun` | 오픈런 여부 | `Y` / `N` |
| `prfstate` | 공연 상태 | 공연예정 / 공연중 / 공연완료 |

---

## 2. 공연 상세 조회

### 엔드포인트

```
GET /pblprfr/{mt20id}
```

### 요청 파라미터

| 파라미터 | 필수 | 설명 |
|---|---|---|
| `service` | Y | API 인증키 |

### 요청 예시

```
GET https://kopis.or.kr/openApi/restful/pblprfr/PF279014?service={API_KEY}
```

### XML 응답 구조 (목록 필드 + 추가 필드)

```xml
<dbs>
  <db>
    <mt20id>PF279014</mt20id>
    <prfnm>영유클래식</prfnm>
    <prfpdfrom>2025.01.11</prfpdfrom>
    <prfpdto>2026.06.28</prfpdto>
    <fcltynm>온쉼표 (온쉼표)</fcltynm>
    <prfcast> </prfcast>              <!-- 출연진 -->
    <prfcrew> </prfcrew>              <!-- 제작진 -->
    <prfruntime>50분</prfruntime>     <!-- 공연 런타임 -->
    <prfage>전체 관람가</prfage>       <!-- 관람 연령 -->
    <entrpsnm> </entrpsnm>            <!-- 제작사 -->
    <entrpsnmP> </entrpsnmP>          <!-- 기획사 -->
    <entrpsnmA> </entrpsnmA>          <!-- 기획사2 -->
    <entrpsnmH> </entrpsnmH>          <!-- 주최사 -->
    <entrpsnmS> </entrpsnmS>          <!-- 주관사 -->
    <pcseguidance>전석 35,000원</pcseguidance> <!-- 티켓 가격 안내 -->
    <poster>http://...</poster>
    <sty>공연 소개 텍스트...</sty>     <!-- 공연 소개 (HTML 포함 가능) -->
    <area>서울특별시</area>
    <genrenm>서양음악(클래식)</genrenm>
    <openrun>N</openrun>
    <visit>N</visit>                  <!-- 내한 공연 여부 -->
    <child>Y</child>                  <!-- 어린이 공연 여부 -->
    <daehakro>N</daehakro>            <!-- 대학로 공연 여부 -->
    <festival>N</festival>            <!-- 축제 여부 -->
    <musicallicense>N</musicallicense> <!-- 뮤지컬 라이선스 여부 -->
    <musicalcreate>N</musicalcreate>  <!-- 창작 뮤지컬 여부 -->
    <updatedate>2026-02-25 16:08:22</updatedate> <!-- 최종 수정일 -->
    <prfstate>공연중</prfstate>
    <mt10id>FC004127</mt10id>         <!-- 공연시설 ID -->
    <dtguidance>토요일 ~ 일요일(10:00,11:20)</dtguidance> <!-- 공연 일정 안내 -->
    <styurls>                         <!-- 소개 이미지 목록 -->
      <styurl>http://...</styurl>
    </styurls>
    <relates>                         <!-- 관련 링크 (예매 사이트 등) -->
      <relate>
        <relatenm>네이버N예약</relatenm>
        <relateurl>https://booking.naver.com/...</relateurl>
      </relate>
    </relates>
  </db>
</dbs>
```

---

## 3. 공연시설 목록 조회

### 엔드포인트

```
GET /prfplc
```

### 주요 파라미터

| 파라미터 | 필수 | 설명 | 예시 |
|---|---|---|---|
| `service` | Y | API 인증키 | - |
| `cpage` | Y | 페이지 번호 | `1` |
| `rows` | Y | 페이지당 결과 수 | `10` |
| `signgucode` | N | 지역 코드 | `11` |
| `shprfnmfct` | N | 시설명 검색어 | - |
| `shcategory` | N | 시설 특성 코드 | - |

### XML 응답 구조

```xml
<dbs>
  <db>
    <fcltynm>온쉼표</fcltynm>     <!-- 시설명 -->
    <mt10id>FC004127</mt10id>    <!-- 시설 ID -->
    <mt13cnt>1</mt13cnt>         <!-- 공연장 수 -->
    <fcltychartr>기타(비공연장)</fcltychartr> <!-- 시설 특성 -->
    <sidonm>서울</sidonm>        <!-- 시도명 -->
    <gugunnm>송파구</gugunnm>    <!-- 구군명 -->
    <opende>2015</opende>        <!-- 개관 연도 -->
  </db>
</dbs>
```

---

## 4. 공연시설 상세 조회

### 엔드포인트

```
GET /prfplc/{mt10id}
```

### XML 응답 추가 필드

```xml
<db>
  <!-- 목록 필드 + 아래 추가 -->
  <seatscale>0</seatscale>         <!-- 좌석 수 -->
  <telno>...</telno>               <!-- 전화번호 -->
  <relateurl>https://...</relateurl> <!-- 관련 URL -->
  <adres>서울특별시 송파구...</adres> <!-- 주소 -->
  <la>37.500244700000000</la>      <!-- 위도 -->
  <lo>127.10666450000000</lo>      <!-- 경도 -->
  <restaurant>N</restaurant>       <!-- 식당 여부 -->
  <cafe>N</cafe>                   <!-- 카페 여부 -->
  <store>N</store>                 <!-- 매점 여부 -->
  <nolibang>N</nolibang>           <!-- 놀이방 여부 -->
  <suyu>N</suyu>                   <!-- 수유실 여부 -->
  <parkbarrier>N</parkbarrier>     <!-- 장애인 주차 여부 -->
  <restbarrier>N</restbarrier>     <!-- 장애인 화장실 여부 -->
  <runwbarrier>N</runwbarrier>     <!-- 장애인 경사로 여부 -->
  <elevbarrier>N</elevbarrier>     <!-- 장애인 엘리베이터 여부 -->
  <parkinglot>N</parkinglot>       <!-- 주차장 여부 -->
  <mt13s>
    <mt13>
      <prfplcnm>온쉼표</prfplcnm>  <!-- 공연장명 -->
      <mt13id>FC004127-01</mt13id> <!-- 공연장 ID -->
      <seatscale>0</seatscale>     <!-- 좌석 수 -->
      <stageorchat>N</stageorchat> <!-- 오케스트라 피트 여부 -->
      <stagepracat>N</stagepracat> <!-- 연습실 여부 -->
      <stagedresat>N</stagedresat> <!-- 분장실 여부 -->
      <stageoutdrat>N</stageoutdrat> <!-- 야외무대 여부 -->
      <disabledseatscale> </disabledseatscale> <!-- 장애인 좌석 수 -->
      <stagearea> </stagearea>     <!-- 무대 면적 -->
    </mt13>
  </mt13s>
</db>
```

---

## 코드 참조표

### 공연 상태 코드 (`prfstate`)

| 코드 | 설명 |
|---|---|
| `01` | 공연예정 |
| `02` | 공연중 |
| `03` | 공연완료 |

### 장르명 (`genrenm`) - 실제 응답값 기준

| 값 | 설명 |
|---|---|
| `연극` | 연극 |
| `뮤지컬` | 뮤지컬 |
| `무용(서양/한국무용)` | 무용 |
| `서양음악(클래식)` | 서양 클래식 음악 |
| `한국음악(국악)` | 국악 |
| `대중음악` | 대중음악 |
| `서커스/마술` | 서커스/마술 |
| `복합` | 복합 장르 |

### 지역 코드 (`signgucode`) - 행정구역 코드 앞 2자리

| 코드 | 지역 |
|---|---|
| `11` | 서울특별시 |
| `21` | 부산광역시 |
| `22` | 대구광역시 |
| `23` | 인천광역시 |
| `24` | 광주광역시 |
| `25` | 대전광역시 |
| `26` | 울산광역시 |
| `29` | 세종특별자치시 |
| `31` | 경기도 |
| `32` | 강원도 |
| `33` | 충청북도 |
| `34` | 충청남도 |
| `35` | 전라북도 |
| `36` | 전라남도 |
| `37` | 경상북도 |
| `38` | 경상남도 |
| `39` | 제주특별자치도 |

---

## 페이지네이션

KOPIS API는 오프셋 기반 페이지네이션을 사용합니다.

- `cpage`: 1부터 시작하는 페이지 번호
- `rows`: 페이지당 항목 수 (최대 제한 미확인, 실험적으로 200까지 동작 확인)
- 응답에 총 결과 수(`totalCount`) 필드는 포함되지 않음

---

## 주의사항

1. 응답 형식은 XML이며 `Content-Type`은 별도 지정 불필요
2. `www.kopis.or.kr` 호스트로 요청 시 `kopis.or.kr`로 301 리다이렉트됨 → 직접 `kopis.or.kr` 사용 권장
3. `shgenrenm` 파라미터는 장르 코드(예: `GGGA`)가 아닌, 응답의 `genrenm` 값 문자열 그대로를 사용해야 할 수 있음 (코드 방식은 필터링 미동작 확인)
4. 날짜 형식: 요청은 `YYYYMMDD`, 응답은 `YYYY.MM.DD`
5. API 키는 `.env.local`의 `KOPIS_API_KEY`로 관리, 코드에 하드코딩 금지
