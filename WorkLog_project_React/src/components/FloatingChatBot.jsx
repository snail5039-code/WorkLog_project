// src/components/FloatingChatBot.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SiteChatBot from "./SiteChatBot";

function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // 홈은 업무 흐름과 기록에 집중하고, 챗봇은 실제 업무 화면에서만 제공한다.
  if (pathname === "/") return null;

  return (
    <div
      style={{
        position: "fixed",   // ✅ 화면에 고정
        bottom: "20px",      // ✅ 아래에서 20px
        right: "20px",       // ✅ 오른쪽에서 20px
        zIndex: 1000,        // ✅ 다른 요소들 위로
      }}
    >
      {/* 챗봇 창 */}
      {open && (
        <div
          style={{
            marginBottom: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <SiteChatBot />
        </div>
      )}

      {/* 토글 버튼 (열기/닫기) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
        }}
        title="사이트 챗봇"
      >
        💬
      </button>
    </div>
  );
}

export default FloatingChatBot;
