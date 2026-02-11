# AttendanceSMS

Google 스프레드시트 출석부와 연동하여 **알리고(Aligo) API**로 학부모/학생에게 LMS 문자를 발송하는 시스템입니다.  
출석·과제·테스트 결과, 복습 영상 링크 등을 주차별로 선택해 일괄 발송할 수 있습니다.

---

## 구성

| 구성 요소 | 설명 |
|----------|------|
| **Node.js 서버** (`server.js`) | 알리고 API로 문자 전송을 대신 호출하는 중계 서버. 23:00~07:00에는 다음날 09:00 예약 발송 |
| **Google Apps Script** (`AppsScript/`) | 스프레드시트에서 출석 데이터를 읽고, 서버로 발송 요청을 보내는 스크립트 및 웹 앱 UI |

---

## 동작 방식

1. **스프레드시트**: 출석부 시트에 학생명, 연락처, 주차별 출석(o/동), 점수, 링크 등이 정해진 형식으로 입력됨.
2. **웹 앱 / 메뉴**: 사용자가 "주차"와 "출석부(시트)"를 선택한 뒤 **과제&테스트** 또는 **복습&동보** 버튼을 누름.
3. **Apps Script**: 선택한 시트·주차에 맞춰 출석한 학생만 필터링하고, SMS 시트의 문구 템플릿(`@name`, `@week`, `@testScore` 등)을 치환해 메시지 생성.
4. **Node 서버**: 생성된 메시지와 수신자 번호를 받아 알리고 API(`https://apis.aligo.in/send/`)로 LMS 발송 (또는 야간 예약).

---

## 디렉터리 구조

```
AttendanceSMS/
├── server.js              # Express 서버 (알리고 API 중계)
├── .env.sample             # 환경 변수 예시
├── .gitignore
├── README.md
└── AppsScript/             # Google 스프레드시트에 배포할 스크립트
    ├── forScript.js        # 시트 값 기반 자동 발송 (sendTests, sendVideos, sendSearched)
    ├── init.js             # onOpen 메뉴, onEdit(성적 계산·검색), processSearch
    ├── readSheet.js        # 출석부 읽기, packStudent, calculate (평균/상위 30% 등)
    ├── sendMsg.js          # 문구 템플릿(writeMSG), prepareSMS, sendSMS(UrlFetch로 서버 호출)
    ├── webapp.js           # doGet, 드롭다운 옵션, buttonOneAction / buttonTwoAction
    └── index.html          # 웹 앱 UI (주차 입력, 출석부 선택, 과제&테스트 / 복습&동보 버튼)
```

---

## 환경 설정

### 1. Node 서버 (로컬 또는 배포 서버)

- Node.js 설치 후 프로젝트 루트에서:

```bash
npm init -y
npm install express axios form-data dotenv
```

- `.env.sample`을 참고해 `.env` 파일 생성:

```env
API_KEY=      # 알리고 API 키
USER_ID=      # 알리고 사용자 ID
SENDER=       # 발신 번호
TITLE=        # LMS 제목
portNum=      # 서버 포트 (예: 3000)
```

- 서버 실행:

```bash
node server.js
```

- 서버가 `http://<서버주소>:<portNum>` 에서 POST 요청을 받을 수 있도록 해 두세요 (로컬 테스트 시 터널링 등).

### 2. Google Apps Script

- 스프레드시트에 `SMS` 시트가 있고, 다음을 준비:
  - 발송 문구 템플릿 (출석용/미출석용 등), `@name`, `@week`, `@testScore` 등 치환자
  - B1: 출석부 시트 이름 드롭다운 데이터 유효성 검사
  - 테스트 모드 체크 등
- `AppsScript/` 내 `.js` 파일들을 스크립트 에디터의 해당 파일들에 맞춰 붙여넣기.
- `sendMsg.js` 상단의 `send_url`, `init.js` 등에서 사용하는 **서버 URL**과 **스프레드시트 ID**를 실제 값으로 설정 (예: `config.js` 또는 스크립트 속성 사용).
- 웹 앱으로 배포하면 `index.html` 기반으로 "주차 / 출석부 선택 → 과제&테스트 or 복습&동보" UI를 사용할 수 있음.
- 시트에서만 쓸 경우 **추가 메뉴 → ✉️문자 발송 → 과제&테스트 / 복습&동보** 로 같은 동작 실행.

---

## 발송 종류

| 기능 | 설명 |
|------|------|
| **과제&테스트** | 해당 주차에 출석(o)한 학생에게만 발송. 성적·평균·상위 30% 등 포함 메시지. |
| **복습&동보** | 출석(o) 또는 동영상 시청(동) 처리된 학생에게 복습/동영상 링크 메시지 발송. |

---

## 주의사항

- `.env` 및 API 키는 반드시 로컬/서버에만 두고, 저장소에 커밋하지 마세요 (`.gitignore`에 `*.env` 포함됨).
- 알리고 서비스 가입 및 LMS 발송 권한·잔액을 확인한 뒤 사용하세요.
- 야간(23:00~07:00)에는 서버가 자동으로 다음날 09:00 예약 발송으로 설정합니다.

---

## 라이선스 / 기여

- 프로젝트 목적에 맞게 자유롭게 수정·사용 가능합니다.  
- 알리고 API 정책 및 Google Apps Script 할당량을 준수해 사용하세요.
