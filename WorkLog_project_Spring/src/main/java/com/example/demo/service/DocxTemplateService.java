package com.example.demo.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.stereotype.Service;

@Service
public class DocxTemplateService {
	// 최종 완성된 docx 파일을 바이트 형태로 돌려주는 메서드임
	public byte[] fileTemplate(String templateFileName, Map<String, String> values) throws IOException {
		 System.out.println(">>> DocxTemplateService.fileTemplate 시작, template = " + templateFileName);
		// classpath에서 템플릿 파일 열기, 즉 경로에서 여는 것
		String path = "templates/" + templateFileName;
		try (InputStream in = getClass().getClassLoader().getResourceAsStream(path)) {
			if (in == null) {
				throw new IllegalArgumentException("템플릿 파일을 찾을 수 없습니다." + path);
			}
			// XWPFDocument 도 try-with-resources 로 묶는다. 안에 OPCPackage 를 들고 있어
			// 닫지 않으면 다운로드 한 번마다 압축 해제된 XML 트리가 그대로 남는다.
			try (XWPFDocument doc = new XWPFDocument(in)) {
				// 문단, 테이블 안에서 플레이스홀더를 치환하는 것!
				replaceInParagraphs(doc, values);
				replaceInTables(doc, values);

				// 메모리 저장 후 바이트 반환, 즉 word 파일 데이터를 메모리 저장
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				doc.write(out);
				return out.toByteArray();
			}
		}
	}
	// 줄 바꿈 메서드 안그러면 인수인계서 이상하게 나옴
    private void setParagraphTextWithNewlines(XWPFParagraph p, String text) {
    	if (text == null) return;

        // 1) 줄바꿈 통일 (\r\n, \r -> \n)
        String normalized = text
                .replace("\r\n", "\n")
                .replace("\r", "\n");

        // 2) 너무 많은 연속 줄바꿈은 줄이기
        //    \n\n\n 이상 -> \n\n 으로 압축  (즉, "한 줄 띄움" 효과만 남김)
        normalized = normalized.replaceAll("\n{3,}", "\n\n");

        // 3) 줄 단위로 나눠서 워드에 넣기
        String[] lines = normalized.split("\n", -1);

        for (int i = 0; i < lines.length; i++) {
            XWPFRun r = p.createRun();
            r.setText(lines[i]);  // 내용이 빈 문자열("")이면 "빈 줄" 역할

            // 마지막 줄이 아니면 줄바꿈 추가
            if (i < lines.length - 1) {
                r.addBreak();
            }
        }
    }
    
	// 예를 들어 문자열이들이 줄바꿈으로 인해서 ${업무"
    //"일자}" 이런식으로 쪼개져 있으면 오류가 나서 붙여주는 작업
	// word 문단 안 텍스트 치환
	public void replaceInParagraphs(XWPFDocument doc, Map<String, String> values) {
		for (XWPFParagraph p : doc.getParagraphs()) { // 문서 안 모든 문단 목록 가져옴
			// 문단 안 텍스트 전부 이어붙이기
			StringBuilder sb = new StringBuilder(); // 이어 붙이는거 
			for (XWPFRun run : p.getRuns()) { // 문단 안 글 조각(run)들을 하나씩 보면서 처리
				String text = run.getText(0); // 첫번째 텍스트 조각, 어쨋든 반복문으로 돌려서 처리 하는거
				if (text != null)
					sb.append(text);
			}
			String original = sb.toString();
			if (original.isEmpty())
				continue;

			String replaced = replaceAllPlaceholders(original, values); // 안에 있는 텍스트 값을 내가 설정한 벨류 값으로 바꾸는 것!
			if (!original.equals(replaced)) {
				
				int runCount = p.getRuns().size();
				for(int i = runCount - 1; i >= 0; i--) {
					p.removeRun(i); // 기존에 있는 텍스트 조각들은 없애주는 것임!
				}
				// 치환한 텍스트 전체 넣기
				 setParagraphTextWithNewlines(p, replaced);
			}
		}
	}

	// 테이블 텍스트 치환 
	private void replaceInTables(XWPFDocument doc, Map<String, String> values) {
	    for (XWPFTable table : doc.getTables()) {
	        for (XWPFTableRow row : table.getRows()) {
	            for (XWPFTableCell cell : row.getTableCells()) {
	                for (XWPFParagraph p : cell.getParagraphs()) {

	                    // 셀 안 문단의 텍스트 전부 이어붙이기
	                    StringBuilder sb = new StringBuilder();
	                    for (XWPFRun run : p.getRuns()) {
	                        String text = run.getText(0);
	                        if (text != null) sb.append(text);
	                    }
	                    String original = sb.toString();
	                    if (original.isEmpty()) continue;
	                    
	                    // 🔹 디버깅용 출력
	                    if (original.contains("TPL1")) {
	                        System.out.println("문단 텍스트 = [" + original + "]");
	                    }

	                    // 2. 플레이스홀더 치환
	                    String replaced = replaceAllPlaceholders(original, values);
	                    if (!original.equals(replaced)) {
	                        // 3. 기존 run 삭제
	                        int runCount = p.getRuns().size();
	                        for (int i = runCount - 1; i >= 0; i--) {
	                            p.removeRun(i); // 위에랑 같은 말임
	                        }
	                        // 4. 새 run 하나로 전체 텍스트 설정
	                        setParagraphTextWithNewlines(p, replaced);
	                    }
	                }
	            }
	        }
	    }
	}

	// 플레이스홀더를 실제값으로 바꿔주는 메서드임
	private String replaceAllPlaceholders(String text, Map<String, String> values) {
		String result = text;
		for (Map.Entry<String, String> e : values.entrySet()) { // 한쌍 씩 보면서 처리
			String placeholder = e.getKey(); // 플레이스홀더 문자열을 변수에 담음
			String value = e.getValue();// 실제로 바꿀 진짜 값임!
			if (result.contains(placeholder)) {
				System.out.println("치환 발견! placeholder = [" + placeholder + "]");
	            System.out.println("원래 문자열 = [" + result + "]");
				result = result.replace(placeholder, value != null ? value : "");
				System.out.println("치환 후 문자열 = [" + result + "]");
			}
		}
		return result;
	}
}
