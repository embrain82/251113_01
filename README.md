# ETF 시세 조회 시스템

ETF(상장지수펀드) 종목의 실시간 시세 정보와 일별/시간대별 가격 변동을 조회할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **ETF 검색**: 종목코드로 ETF 정보 조회
- **기본 정보 표시**: 현재가, 전일대비, 등락률, 시가/고가/저가, 거래량
- **시간대별 시세**: 실시간 체결 가격 및 거래량 정보
- **일별 시세**: 과거 가격 이력 (1개월/3개월/6개월/1년)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **데이터**: Mock JSON (개발), 공공데이터포털 API (프로덕션 예정)
- **배포**: Vercel
- **버전 관리**: Git/GitHub

## 프로젝트 구조

```
251113_01/
├── index.html              # 메인 HTML 페이지
├── css/
│   └── style.css          # 스타일시트
├── js/
│   ├── utils.js           # 유틸리티 함수
│   ├── api.js             # API 호출 로직
│   └── app.js             # 메인 애플리케이션 로직
├── data/
│   └── mock-data.json     # Mock 데이터
├── vercel.json            # Vercel 설정
├── .gitignore             # Git 제외 파일
├── plan.md                # 프로젝트 계획서
└── README.md              # 이 파일
```

## 로컬 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/embrain82/251113_01.git
cd 251113_01
```

### 2. 로컬 서버 실행

**Python 사용:**
```bash
python3 -m http.server 8000
```

**Node.js 사용:**
```bash
npx http-server -p 8000
```

**VS Code Live Server:**
- VS Code에서 index.html 열기
- 우클릭 > "Open with Live Server"

### 3. 브라우저 접속

```
http://localhost:8000
```

## 사용 방법

1. **종목코드 입력**: 검색창에 ETF 종목코드를 입력합니다.
   - 예시: `152100` (KODEX 200), `102110` (TIGER 200), `091160` (KODEX 반도체)

2. **검색**: "검색" 버튼을 클릭하거나 Enter 키를 누릅니다.

3. **정보 확인**:
   - ETF 기본 정보 (현재가, 등락률 등)
   - 시간대별 시세 테이블
   - 일별 시세 테이블

4. **기간 선택**: 일별 시세에서 1개월/3개월/6개월/1년 버튼으로 기간을 선택할 수 있습니다.

## 지원 ETF 목록 (Mock 데이터)

현재 Mock 데이터로 제공되는 ETF:

| 종목코드 | ETF 명칭 |
|---------|---------|
| 152100  | KODEX 200 |
| 102110  | TIGER 200 |
| 091160  | KODEX 반도체 |

## Vercel 배포

### 자동 배포 (권장)

1. **Vercel에 로그인**
   - https://vercel.com 방문
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "New Project" 클릭
   - GitHub 저장소 `embrain82/251113_01` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: `Other`
   - Build Command: (비워두기)
   - Output Directory: `./`
   - Install Command: (비워두기)

4. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 후 URL 확인 (예: https://251113-01.vercel.app)

### CLI 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 환경변수 (향후 API 연동 시)

실제 API 연동 시 필요한 환경변수:

```bash
# .env.local
PUBLIC_DATA_PORTAL_KEY=your-api-key-here
KRX_API_KEY=your-krx-api-key
```

**Vercel 환경변수 설정:**
1. Vercel Dashboard > 프로젝트 선택
2. Settings > Environment Variables
3. 환경변수 추가 (Name, Value, Environment 선택)

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)
- 모바일 브라우저 (iOS Safari, Chrome)

## 개발 로드맵

- [x] Phase 1: 프로토타입 (Mock 데이터)
  - [x] HTML/CSS/JS 기본 구조
  - [x] Mock 데이터 연동
  - [x] 반응형 디자인
- [x] Vercel 배포 설정
- [ ] Phase 2: 실제 API 연동
  - [ ] 공공데이터포털 API 연동
  - [ ] 실시간 데이터 업데이트
- [ ] Phase 3: 고도화
  - [ ] 차트 시각화
  - [ ] 즐겨찾기 기능
  - [ ] 다중 종목 비교

## 데이터 소스

**현재 (개발 단계):**
- Mock JSON 데이터

**향후 계획:**
- [공공데이터포털 - 금융위원회_증권상품시세정보 API](https://www.data.go.kr/data/15094806/openapi.do)
- [한국거래소(KRX) 정보데이터시스템](https://data.krx.co.kr)
- [PyKRX](https://github.com/sharebook-kr/pykrx) (Python 라이브러리)

## 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 면책사항

본 서비스에서 제공하는 정보는 투자 참고용이며, 투자 판단 및 결과에 대한 책임은 투자자 본인에게 있습니다.

## 기여

버그 리포트 및 기능 제안은 [Issues](https://github.com/embrain82/251113_01/issues)에 등록해주세요.

## 문의

프로젝트 관련 문의: GitHub Issues 또는 embrain82@github.com

---

**제작**: embrain82
**최종 업데이트**: 2025-11-13
