CREATE DATABASE IF NOT EXISTS workLog_project
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE workLog_project;

CREATE TABLE IF NOT EXISTS member (
  id INT NOT NULL AUTO_INCREMENT,
  regDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  loginId VARCHAR(100) NOT NULL,
  loginPw VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sex VARCHAR(10) DEFAULT 'N',
  address VARCHAR(255) DEFAULT '',
  PRIMARY KEY (id),
  UNIQUE KEY uk_member_login_id (loginId),
  UNIQUE KEY uk_member_email (email)
);

CREATE TABLE IF NOT EXISTS workLog (
  id INT NOT NULL AUTO_INCREMENT,
  regDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  mainContent LONGTEXT,
  sideContent LONGTEXT,
  summaryContent LONGTEXT,
  templateId VARCHAR(100),
  memberId INT NOT NULL,
  boardId INT NOT NULL DEFAULT 4,
  PRIMARY KEY (id),
  KEY idx_worklog_member_board_date (memberId, boardId, regDate),
  CONSTRAINT fk_worklog_member FOREIGN KEY (memberId) REFERENCES member (id)
);

CREATE TABLE IF NOT EXISTS fileAttach (
  id INT NOT NULL AUTO_INCREMENT,
  regDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  workLogId INT NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  filePath VARCHAR(1000) NOT NULL,
  fileSize BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_file_worklog (workLogId),
  CONSTRAINT fk_file_worklog FOREIGN KEY (workLogId) REFERENCES workLog (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rePly (
  id INT NOT NULL AUTO_INCREMENT,
  regDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  workLogId INT NOT NULL,
  memberId INT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_reply_worklog (workLogId),
  CONSTRAINT fk_reply_worklog FOREIGN KEY (workLogId) REFERENCES workLog (id) ON DELETE CASCADE,
  CONSTRAINT fk_reply_member FOREIGN KEY (memberId) REFERENCES member (id)
);

CREATE TABLE IF NOT EXISTS handoverLog (
  id INT NOT NULL AUTO_INCREMENT,
  regDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  memberId INT NOT NULL,
  writerName VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  toName VARCHAR(100),
  toJob VARCHAR(100),
  fromJob VARCHAR(100),
  fromDate DATE,
  toDate DATE,
  content LONGTEXT,
  PRIMARY KEY (id),
  KEY idx_handover_member (memberId),
  CONSTRAINT fk_handover_member FOREIGN KEY (memberId) REFERENCES member (id)
);

CREATE TABLE IF NOT EXISTS pageContent (
  id BIGINT NOT NULL AUTO_INCREMENT,
  url VARCHAR(1500) NOT NULL,
  title VARCHAR(500),
  content LONGTEXT,
  crawled_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uk_page_url (url(255))
);

INSERT INTO member (id, loginId, loginPw, name, email, sex, address)
VALUES (1, 'developer', SHA2('developer', 256), '개발자', 'developer@worklog.local', 'N', '로컬 개발 환경')
ON DUPLICATE KEY UPDATE name = VALUES(name), updateDate = NOW();

INSERT INTO workLog (id, regDate, updateDate, title, mainContent, sideContent, summaryContent, templateId, memberId, boardId)
VALUES
  (1, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, '개발자 모드 화면 점검', '로그인 없이 내부 기능의 화면과 동작을 확인했습니다.', '목록과 상세 페이지 연결 확인', '개발자 모드의 기본 동작을 점검했습니다.', '1', 1, 4),
  (2, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 'WorkLog 디자인 통일', '소개 페이지와 내부 화면의 색상과 레이아웃을 정리했습니다.', '로그인 화면 대비 개선', '외부와 내부 디자인 시스템을 통일했습니다.', '1', 1, 4),
  (3, NOW(), NOW(), '오늘의 업무 계획', '미리보기와 개발자 모드를 최종 확인합니다.', '서버 및 데이터베이스 연결 점검', '전체 기능 테스트 환경을 준비했습니다.', '1', 1, 4)
ON DUPLICATE KEY UPDATE title = VALUES(title), mainContent = VALUES(mainContent), updateDate = VALUES(updateDate);

INSERT INTO handoverLog (id, memberId, writerName, title, toName, toJob, fromJob, fromDate, toDate, content)
VALUES (1, 1, '개발자', '샘플 인수인계', '다음 담당자', '개발자', '개발자', CURDATE() - INTERVAL 7 DAY, CURDATE(), '개발자 모드에서 인수인계 목록과 다운로드 화면을 확인하기 위한 샘플입니다.')
ON DUPLICATE KEY UPDATE title = VALUES(title), updateDate = NOW();
