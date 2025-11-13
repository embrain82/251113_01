# ETF 시세 정보 페이지 개발 플랜

## 프로젝트 개요
네이버 금융(https://finance.naver.com/item/sise.naver?code=0025N0)을 참고하여 ETF 상품의 시간대별 시세와 일별 시세를 조회할 수 있는 웹 페이지 개발

## 주요 기능

### 1. ETF 검색 기능
- ETF 종목코드 입력 인터페이스
- 종목명 자동완성 (옵션)
- 검색 버튼

### 2. ETF 기본 정보 표시
- 종목명
- 현재가
- 전일 대비 (금액/등락률)
- 시가
- 고가
- 저가
- 거래량
- 거래대금

### 3. 시간대별 시세
**표시 항목:**
- 체결시간
- 현재가
- 전일대비
- 등락률
- 거래량
- 누적거래량

**기능:**
- 실시간 또는 주기적 업데이트 (옵션)
- 최근 N개의 시간대별 데이터 표시
- 시간 역순 정렬 (최신 데이터가 상단)

### 4. 일별 시세
**표시 항목:**
- 날짜
- 종가
- 전일대비
- 등락률
- 시가
- 고가
- 저가
- 거래량

**기능:**
- 페이지네이션 또는 스크롤 로딩
- 기간 선택 (1개월, 3개월, 6개월, 1년 등)
- 날짜 역순 정렬 (최신 날짜가 상단)

## 기술 스택

### Frontend
- **HTML5**: 마크업 구조
- **CSS3**: 스타일링 및 반응형 디자인
  - 테이블 레이아웃
  - 등락률에 따른 색상 표시 (상승: 빨강, 하락: 파랑)
- **JavaScript (Vanilla or Framework)**: 동적 기능 구현
  - 옵션 1: Vanilla JS (가벼운 구현)
  - 옵션 2: React/Vue (컴포넌트 기반 개발)

### Backend (데이터 소스)
**옵션 1: 공공 데이터 API (무료, 추천)**
- 공공데이터포털 - 금융위원회_증권상품시세정보 API
- 한국거래소(KRX) 정보데이터시스템 API
- PyKRX (Python 오픈소스 라이브러리)

**옵션 2: 증권사 Open API (무료/유료)**
- 한국투자증권 Open API
- 키움증권 Open API+
- eBest 투자증권 Open API

**옵션 3: 크롤링 (주의: 법적 이슈 검토 필요)**
- Python (BeautifulSoup, Selenium)
- Node.js (Puppeteer, Cheerio)
- ⚠️ 네이버 금융 등 상업 서비스 크롤링 시 이용약관 확인 필수

**옵션 4: Mock 데이터**
- 초기 개발 단계에서 샘플 데이터 사용
- JSON 파일 또는 로컬 데이터베이스

### 데이터베이스 (옵션)
- SQLite (간단한 구현)
- PostgreSQL/MySQL (확장 가능한 구현)
- MongoDB (NoSQL 옵션)

## 프로젝트 구조

```
251113_01/
├── index.html              # 메인 페이지
├── css/
│   └── style.css          # 스타일시트
├── js/
│   ├── app.js             # 메인 애플리케이션 로직
│   ├── api.js             # API 호출 관련
│   └── utils.js           # 유틸리티 함수
├── data/
│   └── mock-data.json     # 샘플 데이터 (개발용)
├── backend/ (옵션)
│   ├── server.js          # Node.js 서버
│   ├── routes/            # API 라우트
│   └── controllers/       # 비즈니스 로직
├── plan.md                # 이 파일
└── README.md              # 프로젝트 설명서
```

## 개발 단계

### Phase 1: 프로토타입 (1-2일)
1. HTML 구조 작성
2. CSS 기본 스타일링
3. Mock 데이터로 정적 페이지 구현
4. 시간대별/일별 시세 테이블 표시

### Phase 2: 동적 기능 구현 (2-3일)
1. JavaScript로 데이터 바인딩
2. ETF 종목코드 입력 기능
3. 데이터 필터링 및 정렬
4. 반응형 디자인 적용

### Phase 3: 데이터 연동 (3-4일)
1. 실제 API 또는 데이터 소스 연동
2. 에러 핸들링
3. 로딩 상태 표시
4. 데이터 캐싱 (성능 최적화)

### Phase 4: 고도화 (추가 기능)
1. 차트 시각화 (Chart.js, D3.js)
2. 실시간 데이터 업데이트 (WebSocket)
3. 즐겨찾기 기능
4. 다중 종목 비교
5. 알림 기능

## UI/UX 디자인 가이드

### 레이아웃
```
+------------------------------------------+
|  ETF 시세 조회                            |
|  [종목코드 입력] [검색]                    |
+------------------------------------------+
|  ETF 기본 정보                            |
|  종목명: KODEX 200               |
|  현재가: 35,000원 ▲500 (+1.45%)          |
|  시가: 34,800 | 고가: 35,200 | 저가: 34,700|
+------------------------------------------+
|  시간대별 시세                            |
|  시간    | 현재가  | 전일대비 | 거래량    |
|  15:30  | 35,000 | ▲500   | 1,234    |
|  15:29  | 34,950 | ▲450   | 1,100    |
|  ...                                     |
+------------------------------------------+
|  일별 시세                                |
|  날짜      | 종가   | 전일대비 | 거래량   |
|  2025-11-13| 35,000| ▲500   | 1,234,567|
|  2025-11-12| 34,500| ▼200   | 987,654  |
|  ...                                     |
+------------------------------------------+
```

### 색상 스키마
- **상승**: #FF0000 (빨강)
- **하락**: #0000FF (파랑)
- **보합**: #000000 (검정)
- **배경**: #FFFFFF (흰색) / #F5F5F5 (연한 회색)
- **테두리**: #DDDDDD (회색)

### 폰트
- 제목: Bold, 18-24px
- 본문: Regular, 14-16px
- 숫자: Monospace 또는 Tabular Numbers

## 데이터 API 명세 (예시)

### 1. ETF 기본 정보 조회
```
GET /api/etf/{code}

Response:
{
  "code": "0025N0",
  "name": "KODEX 200",
  "currentPrice": 35000,
  "change": 500,
  "changePercent": 1.45,
  "open": 34800,
  "high": 35200,
  "low": 34700,
  "volume": 1234567,
  "amount": 43210000000
}
```

### 2. 시간대별 시세 조회
```
GET /api/etf/{code}/intraday?limit=50

Response:
{
  "data": [
    {
      "time": "15:30:00",
      "price": 35000,
      "change": 500,
      "changePercent": 1.45,
      "volume": 1234
    },
    ...
  ]
}
```

### 3. 일별 시세 조회
```
GET /api/etf/{code}/daily?startDate=2025-10-13&endDate=2025-11-13

Response:
{
  "data": [
    {
      "date": "2025-11-13",
      "close": 35000,
      "change": 500,
      "changePercent": 1.45,
      "open": 34800,
      "high": 35200,
      "low": 34700,
      "volume": 1234567
    },
    ...
  ]
}
```

## 주의사항 및 고려사항

### 법적 이슈
- 네이버 금융 등 기존 서비스의 데이터 크롤링 시 저작권 및 이용약관 검토 필요
- 공식 API 사용 권장

### 성능 최적화
- 대용량 데이터 로딩 시 가상 스크롤(Virtual Scroll) 고려
- API 응답 캐싱
- 이미지 스프라이트 사용 (아이콘 등)

### 보안
- API Key 관리 (환경변수 사용)
- CORS 정책 설정
- XSS, CSRF 방어

### 접근성
- 스크린 리더 지원
- 키보드 네비게이션
- 색맹 사용자를 위한 패턴/아이콘 추가 사용

## 테스트 계획
1. 단위 테스트: 유틸리티 함수, API 호출 로직
2. 통합 테스트: 컴포넌트 간 상호작용
3. E2E 테스트: 사용자 시나리오 기반
4. 성능 테스트: 대용량 데이터 로딩
5. 크로스 브라우저 테스트: Chrome, Firefox, Safari, Edge

## 배포
- **개발 환경**: localhost
- **스테이징**: GitHub Pages / Vercel / Netlify
- **프로덕션**: AWS / GCP / Azure (필요 시)

## 다음 단계
1. ✅ 프로젝트 플랜 작성 완료
2. ⬜ HTML 프로토타입 작성
3. ⬜ CSS 스타일링
4. ⬜ JavaScript 기본 기능 구현
5. ⬜ Mock 데이터 연동
6. ⬜ 실제 API 연동
7. ⬜ 테스트 및 디버깅
8. ⬜ 배포

## ETF 데이터 소스 상세 정보

### 1. 공공데이터포털 - 금융위원회_증권상품시세정보 API ⭐ 추천

**개요:**
- 한국거래소에서 제공하는 상장 ETF, ETN, ELW의 시세 정보
- 시가, 종가, 고가, 저가, 거래량, 변동률 등 제공

**사용 방법:**
1. 공공데이터포털(www.data.go.kr) 회원가입
2. API 활용신청 (활용목적 작성)
3. 승인 후 API 키 발급
4. REST API 호출

**API 정보:**
- URL: https://www.data.go.kr/data/15094806/openapi.do
- 제공 오퍼레이션:
  - 상장지수펀드(ETF) 종목별 시세 조회
  - 상장지수채권(ETN) 종목별 시세 조회
  - 주식워런트증권(ELW) 종목별 시세 조회
- 요청 파라미터: `basDt` (기준일자, YYYYMMDD 형식)
- 응답 형식: JSON/XML

**장점:**
- ✅ 무료
- ✅ 공식 데이터 (신뢰성 높음)
- ✅ 법적 문제 없음
- ✅ Swagger UI 제공 (테스트 편리)

**단점:**
- ⚠️ 실시간 데이터 아닌 일별 데이터
- ⚠️ 기준일자(basDt) 파라미터 주의 필요

**활용 예시:**
```
GET https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo
?serviceKey={API_KEY}
&basDt=20251113
&numOfRows=10
&pageNo=1
```

---

### 2. 한국거래소(KRX) 정보데이터시스템 API

**개요:**
- KRX에서 직접 제공하는 공식 데이터
- 주식, ETF, ETN, 파생상품, 공매도 정보 등 제공

**사용 방법:**
1. KRX 정보데이터시스템(data.krx.co.kr) 회원가입
2. 마이페이지에서 'API 인증키 신청'
3. 원하는 데이터 서비스 이용 신청
4. API 호출 (일 10,000회 제한)

**API 정보:**
- URL: http://data.krx.co.kr
- ETF 일별매매정보: `http://data-dbg.krx.co.kr/svc/apis/etp/etf_bydd_trd`
- 요청 방식: REST API
- 인증: API Key

**장점:**
- ✅ 무료 (비상업적 용도)
- ✅ 한국거래소 공식 데이터
- ✅ 다양한 데이터 제공 (주식, ETF, 파생상품 등)

**단점:**
- ⚠️ 일 10,000회 호출 제한
- ⚠️ 비상업적 사용 제한
- ⚠️ API 승인 절차 필요

---

### 3. PyKRX (Python 오픈소스 라이브러리) ⭐ 개발 편의성

**개요:**
- KRX 데이터를 쉽게 가져올 수 있는 Python 라이브러리
- 주식, ETF, ETN, ELW, 채권, 파생상품 데이터 지원

**설치:**
```bash
pip install pykrx
```

**사용 예시:**
```python
from pykrx import stock
from pykrx import bond

# ETF 티커 리스트 조회
etf_list = stock.get_etf_ticker_list()

# ETF 일별 시세 조회
df = stock.get_etf_ohlcv_by_date("20251001", "20251113", "152100")
# 152100: KODEX 200 ETF 코드

# ETF 포트폴리오 조회
portfolio = stock.get_etf_portfolio_deposit_file("152100")
```

**장점:**
- ✅ 무료 오픈소스
- ✅ 설치 및 사용 간편
- ✅ Python 환경에서 즉시 활용 가능
- ✅ 일별/분별 데이터 모두 지원
- ✅ API 키 불필요

**단점:**
- ⚠️ 웹 스크래핑 기반 (KRX 웹사이트 변경 시 작동 중단 가능)
- ⚠️ Python 환경 필요

**GitHub:** https://github.com/sharebook-kr/pykrx

---

### 4. 한국투자증권 Open API

**개요:**
- 국내/해외 주식 시세, 잔고조회, 주문 등 제공
- REST API + WebSocket 지원

**사용 방법:**
1. 한국투자증권 계좌 개설
2. KIS Developers 포털(https://apiportal.koreainvestment.com) 가입
3. 앱 등록 후 App Key, App Secret 발급
4. 토큰 발급 후 API 호출

**API 정보:**
- URL: https://apiportal.koreainvestment.com
- 실시간 시세: WebSocket 지원
- 일별/분별 시세 조회 가능

**장점:**
- ✅ 실시간 데이터 제공 (WebSocket)
- ✅ 주식 + ETF 모두 지원
- ✅ 풍부한 문서 및 샘플 코드

**단점:**
- ⚠️ 계좌 개설 필요
- ⚠️ API 신청 및 승인 절차
- ⚠️ 일 API 호출 제한 있음

**GitHub:** https://github.com/koreainvestment/open-trading-api

---

### 5. 키움증권 Open API+

**개요:**
- 실시간 시세, 조건검색, 주문 등 제공
- ActiveX/COM 기반 (Windows 전용)

**사용 방법:**
1. 키움증권 계좌 개설
2. Open API+ 신청
3. KOA Studio 다운로드 및 설치
4. Python 또는 C++ 연동

**장점:**
- ✅ 실시간 데이터 제공
- ✅ 강력한 조건검색 기능
- ✅ 오랜 역사 (안정성)

**단점:**
- ⚠️ Windows 전용 (Linux/Mac 미지원)
- ⚠️ ActiveX 기반 (보안 이슈)
- ⚠️ 계좌 개설 필요

**다운로드:** https://www.kiwoom.com/h/customer/download/VOpenApiInfoView

---

### 6. 기타 데이터 소스

**공공데이터포털 - KRX상장종목정보:**
- ETF 기본 정보 (종목명, 상장일자, 종목코드 등)
- URL: https://www.data.go.kr/data/15094775/openapi.do

**한국예탁결제원 주식정보서비스:**
- 주식/ETF 기본 정보
- URL: https://www.data.go.kr/data/15001145/openapi.do

**Yahoo Finance API:**
- 국내 ETF 일부 지원
- 무료, API 키 불필요
- 주의: 한국 시장 데이터 제한적

---

### 데이터 소스 비교표

| 데이터 소스 | 비용 | 실시간 | 일별 | 가입 | API키 | 호출제한 | 추천도 |
|------------|------|--------|------|------|-------|----------|--------|
| 공공데이터포털 | 무료 | ❌ | ✅ | ✅ | ✅ | 중간 | ⭐⭐⭐⭐⭐ |
| KRX API | 무료 | ❌ | ✅ | ✅ | ✅ | 10,000/일 | ⭐⭐⭐⭐ |
| PyKRX | 무료 | ❌ | ✅ | ❌ | ❌ | 낮음 | ⭐⭐⭐⭐⭐ |
| 한국투자증권 | 무료 | ✅ | ✅ | ✅ | ✅ | 있음 | ⭐⭐⭐⭐ |
| 키움증권 | 무료 | ✅ | ✅ | ✅ | ✅ | 있음 | ⭐⭐⭐ |
| 네이버 크롤링 | 무료 | ⚠️ | ✅ | ❌ | ❌ | 없음 | ⭐⭐ |

---

### 추천 구현 방안

**Phase 1: 프로토타입 (Mock 데이터)**
- Mock JSON 데이터로 UI 구현
- 빠른 프론트엔드 개발

**Phase 2: 공공 API 연동**
- 공공데이터포털 API 또는 PyKRX 사용
- 안정적인 일별 시세 데이터 확보

**Phase 3: 실시간 데이터 (옵션)**
- 한국투자증권 API로 실시간 WebSocket 연동
- 시간대별 시세 업데이트

---

## 참고 자료

### 데이터 소스
- 공공데이터포털: https://www.data.go.kr
- 한국거래소 KRX: https://data.krx.co.kr
- 한국투자증권 API: https://apiportal.koreainvestment.com
- PyKRX GitHub: https://github.com/sharebook-kr/pykrx

### 참고 사이트
- 네이버 금융: https://finance.naver.com
- 금융투자협회: https://www.kofia.or.kr
- 한국거래소: http://www.krx.co.kr
