# 계기
- 최초 업무 종료 후 업무일지 작성이라는 추가적인 업무가 부여되 일찍 집에 가지 못하는 상황이 많아 그것을 조금이라도 빠르게 해결하고자 만들자고 계획

# WorkLog (업무일지 · 요약 · 문서(DOCX 템플릿) 산출 자동화)
- **기간:** 2025.11.22 ~ 2025.12.17  
업무 기록을 **일/주/월 단위로 작성**하고, **요약 및 템플릿 기반 DOCX 문서로 자동 산출**하는 웹 서비스입니다.  
“운영 가능한 시스템”을 목표로 **요구사항 → DB/API → 예외/로그 → 산출물** 흐름을 끝까지 구현했습니다.

> 구성: `WorkLog_project_Spring(Backend)` + `WorkLog_project_React(Frontend)`

---

## 핵심 기능
- **업무일지 작성/조회**: 일간/주간/월간 기록 관리
- **요약 자동화**: 주간/월간 요약(프로젝트 문맥 기반 정리)
- **DOCX 템플릿 산출**: 템플릿 선택 → 플레이스홀더 치환 → 문서 다운로드
- **인수인계 문서 생성**: 이슈/성과를 정리해 인수인계 문서 형태로 출력
- **운영 관점 품질 관리**: 예외 분리, 로그 기반 재현/원인 추적 흐름 적용

---

## 기술 스택
### Backend (Spring Boot)
- Java / Spring Boot (REST API)
- MyBatis (Mapper/SQL 분리)
- MySQL
- 문서 처리: DOCX 템플릿 치환(최종 산출은 DOCX 중심)
- 예외/검증/로그: Validation, ExceptionHandler, 운영 로그 기준 정리
- 요약 기능: Spring AI(OpenAI) 연동 구조

### Frontend (React)
- React + Vite
- Axios API 연동 / 상태 관리
- UI 구성(리스트/상세/필터/페이지네이션 흐름)

### Tools
- Git/GitHub (브랜치 전략, PR 기반 협업)
- Notion(작업 로그/의사결정/재현 절차 기록)

---

## 아키텍처 (요약)
- FE(React) → BE(Spring) → DB(MySQL)
- 문서 산출: 사용자 입력/조회 → 템플릿 선택 → 서버에서 치환/생성 → 다운로드
- 운영 대응: 재현 가능한 로그/예외 분리로 장애 원인 추적

---

## 폴더 구조
```bash
WorkLog_project
├─ WorkLog_project_React
└─ WorkLog_project_Spring
```

## 실행 방법 (로컬)

아래는 “일반적인 구성” 기준입니다. 레포 설정에 맞게 값만 채우면 됩니다.

1) DB(MySQL) 준비

## DB 생성 후 계정/권한 설정

application.yml(properties)에 DB 접속 정보 입력

2) Backend 실행
cd WorkLog_project_Spring
Maven
mvn spring-boot:run

3) Frontend 실행
cd WorkLog_project_React
npm install
npm run dev

## 내가 한일

요구사항 정리 → DB 설계/ERD → REST API → UI 연동 → 예외/로그 → DOCX 산출까지 엔드투엔드 구현

템플릿 산출/요약 기능에서 “동작”이 아니라 운영 안정성(예외 분리, 재현 가능한 로그) 기준으로 개선


## 발표 자료
- [PPT 다운로드](https://docs.google.com/presentation/d/1XuoEwugzBxHUy2-d6O0ZkvLRTWGguqHm/edit?usp=drive_link&ouid=112309789916009126624&rtpof=true&sd=true)
- 발표 자료 안에는 트러블 슈팅 관련 내용 포함
  
## 미리보기
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2e4caa3d-8cbe-4322-8460-88471340a8a5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c9863cd7-b685-4370-981f-e7d9030c4a15" />

## 개인 프로젝트(노션 정리)
- [노션 방문하기](https://www.notion.so/2ecc2c49a250802ca80bd418e5d148fe?source=copy_link)

