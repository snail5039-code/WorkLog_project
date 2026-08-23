import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const workEntries = [
  { id: 1, time: "09:00 - 10:00", title: "주간 팀 미팅", detail: "이번 주 목표와 주요 이슈 공유", meta: "회의록", tone: "coral", x: "8%", top: 8, line: 120 },
  { id: 2, time: "10:30 - 11:30", title: "프로젝트 A 진행 리뷰", detail: "핵심 기능 개발 현황 점검", meta: "4명", tone: "coral", x: "17%", top: 292, line: -74 },
  { id: 3, time: "13:00 - 15:00", title: "프로젝트 A", detail: "기능 설계 및 문서 정리", meta: "집중", tone: "blue", x: "29%", top: 22, line: 114 },
  { id: 4, time: "12:00 - 13:00", title: "점심시간", detail: "가볍게 산책하며 쉬기", meta: "완료", tone: "sand", x: "40%", top: 304, line: -68 },
  { id: 5, time: "15:30 - 17:00", title: "집중 업무", detail: "고객사 보고서 작성", meta: "진행 중", tone: "blue", x: "62%", top: 28, line: 112 },
  { id: 6, time: "14:00 - 15:00", title: "보고서 초안 작성", detail: "보고서 구조와 자료 정리", meta: "완료", tone: "sand", x: "56%", top: 304, line: -66 },
  { id: 7, time: "17:30 - 18:00", title: "데일리 체크인", detail: "오늘 업무 마무리 및 내일 계획", meta: "3명", tone: "coral", x: "82%", top: 20, line: 118 },
];

const toneStyles = {
  coral: { card: "border-[#efc9bb] bg-[#fffaf7]", badge: "bg-[#fff0ea] text-[#d85b39]", dot: "#df6948" },
  blue: { card: "border-[#bed0ed] bg-[#f9fbff]", badge: "bg-[#edf4ff] text-[#3f68aa]", dot: "#5479b7" },
  sand: { card: "border-[#e7d8bf] bg-[#fffdf8]", badge: "bg-[#fbf4e7] text-[#987230]", dot: "#b9a67f" },
};

const workMenus = [
  { label: "일일 업무일지", sub: "오늘의 기록 작성", to: "/write", icon: "✎" },
  { label: "주간 업무보고", sub: "한 주 흐름 정리", to: "/weeklyWrite", icon: "▦" },
  { label: "월간 업무보고", sub: "이번 달 성과 확인", to: "/monthlyWrite", icon: "□" },
  { label: "인수인계", sub: "업무 맥락 이어주기", to: "/handoverList", icon: "⇄" },
  { label: "업무 기록함", sub: "지난 기록 찾아보기", to: "/list", icon: "⌕" },
];

function getToday() {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(new Date());
}

function BrandMark() {
  return (
    <span className="relative inline-block h-6 w-6" aria-hidden="true">
      <span className="absolute left-[2px] top-[3px] h-3 w-2 rotate-[-38deg] rounded-[100%_0] bg-[#dc5b37]" />
      <span className="absolute right-[2px] top-[1px] h-3 w-2 rotate-[38deg] rounded-[0_100%] bg-[#dc5b37]" />
      <span className="absolute left-[9px] top-[10px] h-3 w-2 rounded-[100%_0] bg-[#dc5b37]" />
    </span>
  );
}

function EntryCard({ entry }) {
  const tone = toneStyles[entry.tone];
  const lineDown = entry.line > 0;
  return (
    <article
      className={`absolute z-20 w-[188px] rounded-xl border p-4 shadow-[0_8px_24px_rgba(48,36,27,0.035)] ${tone.card}`}
      style={{ left: entry.x, top: entry.top }}
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${tone.badge}`}>{entry.tone === "blue" ? "✓" : "◇"}</span>
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-bold text-[#26334a]">{entry.title}</h3>
          <p className="mt-1 text-[10px] text-[#85817c]">{entry.time}</p>
          <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-[#5b6069]">{entry.detail}</p>
          <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[9px] ${tone.badge}`}>{entry.meta}</span>
        </div>
      </div>
      <span
        className="absolute left-1/2 w-px border-l border-dashed border-[#d8cec7]"
        style={lineDown ? { top: "100%", height: entry.line } : { bottom: "100%", height: Math.abs(entry.line) }}
        aria-hidden="true"
      />
      <span
        className="absolute h-1.5 w-1.5 rounded-full"
        style={{ left: "calc(50% - 3px)", background: tone.dot, ...(lineDown ? { top: `calc(100% + ${entry.line}px)` } : { bottom: `calc(100% + ${Math.abs(entry.line)}px)` }) }}
        aria-hidden="true"
      />
    </article>
  );
}

function Home() {
  const { isLoginedId } = useContext(AuthContext);
  const isLoggedIn = isLoginedId !== 0;
  const [focusMode, setFocusMode] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(true);
  const today = useMemo(() => getToday(), []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fdfcf9] text-[#1f2e45]">
      <header className="flex min-h-[74px] items-center justify-between border-b border-[#eee7e1] px-5 md:px-9">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <BrandMark /><span className="font-serif text-2xl font-bold tracking-[-0.03em] text-[#d95635]">WorkLog</span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <strong className="font-serif text-base text-[#292f3a]">{today}</strong><span className="text-[#d96543]">☼</span><span className="text-xs text-[#8b8984]">맑음 22°C</span>
        </div>
        {isLoggedIn ? (
          <Link to="/mypage" className="flex items-center gap-2 text-sm text-[#333a46] no-underline">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaded4] text-xs font-bold">민</span><span className="hidden sm:inline">민준님</span><span className="text-[10px]">⌄</span>
          </Link>
        ) : (
          <Link to="/login" className="rounded-full border border-[#eadfd7] px-4 py-2 text-xs text-[#4e5664] no-underline hover:bg-[#fff7f2]">로그인</Link>
        )}
      </header>

      <nav className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto px-4 py-4" aria-label="WorkLog 주요 기능">
        {workMenus.map((menu) => (
          <Link key={menu.label} to={menu.to} className="group flex min-w-[205px] flex-1 items-center gap-3 rounded-xl border border-transparent px-4 py-3 no-underline transition hover:border-[#eee2da] hover:bg-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff1ea] text-sm text-[#d75d3b] group-hover:bg-[#d75d3b] group-hover:text-white">{menu.icon}</span>
            <span><strong className="block text-xs text-[#303947]">{menu.label}</strong><small className="mt-1 block text-[10px] text-[#94918c]">{menu.sub}</small></span>
          </Link>
        ))}
      </nav>

      <main className="mx-auto max-w-[1500px] px-4 pb-8 md:px-8">
        <div className="flex h-10 items-center justify-between md:justify-end">
          <span className="font-serif text-sm md:hidden">{today}</span>
          <button type="button" onClick={() => setFocusMode((value) => !value)} className={`rounded-full border px-4 py-2 text-xs transition ${focusMode ? "border-[#da6241] bg-[#da6241] text-white" : "border-[#eadfd7] bg-white text-[#49505c] hover:bg-[#fff8f4]"}`}>☼ {focusMode ? "집중 중" : "집중 모드"}</button>
        </div>

        <section className="relative hidden h-[455px] lg:block" aria-label="오늘의 업무 흐름">
          <svg className="absolute left-0 top-[203px] h-[110px] w-full" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 67 C115 76,145 49,255 46 S430 35,555 55 S750 91,890 68 S1080 48,1195 66 S1340 88,1440 64" fill="none" stroke="#334f73" strokeWidth="1.6" />
          </svg>
          {workEntries.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
          <div className="absolute left-[46.5%] top-[202px] z-30 text-center">
            <span className="block text-xs font-bold text-[#db5d3a]">12:32</span><span className="mx-auto mt-1 block h-4 w-4 rounded-full border-[3px] border-[#f4c4b3] bg-[#dc5b37] shadow-[0_0_0_7px_rgba(220,91,55,0.08)]" /><span className="mt-1 block text-[10px] font-semibold text-[#dc5b37]">지금 여기</span>
          </div>
          {[["09:00","아침 시작","0%"],["12:00","점심시간","36%"],["15:00","오후 집중","65%"],["18:00","하루 마무리","94%"]].map(([time,label,left]) => (
            <div key={time} className="absolute top-[305px] text-center" style={{ left }}><strong className="font-serif text-sm">{time}</strong><span className="mt-1 block text-[10px] text-[#96928d]">{label}</span></div>
          ))}
        </section>

        <section className="grid gap-3 py-5 lg:hidden" aria-label="오늘의 업무 목록">
          {workEntries.map((entry) => { const tone = toneStyles[entry.tone]; return (
            <article key={entry.id} className={`rounded-xl border p-4 ${tone.card}`}><div className="flex items-start justify-between gap-4"><div><span className="text-[10px] text-[#8d8a84]">{entry.time}</span><h3 className="mt-1 text-sm font-bold">{entry.title}</h3><p className="mt-1 text-xs text-[#6d7075]">{entry.detail}</p></div><span className={`rounded-full px-2 py-1 text-[10px] ${tone.badge}`}>{entry.meta}</span></div></article>
          ); })}
        </section>

        <section className="overflow-hidden rounded-[22px] border border-[#eee5de] bg-white shadow-[0_14px_45px_rgba(70,49,35,0.06)]">
          <div className="flex items-center justify-between px-6 py-4">
            <button type="button" onClick={() => setRecordsOpen((value) => !value)} className="flex items-center gap-3 text-sm font-bold" aria-expanded={recordsOpen}><span className="text-xs">{recordsOpen ? "⌃" : "⌄"}</span> 오늘 작성한 업무일지 4개</button>
            <div className="flex items-center gap-4"><Link to="/list?boardId=4" className="text-xs text-[#666b72] no-underline">전체 기록</Link><Link to="/write" className="text-xs text-[#666b72] no-underline">✎ 빠른 기록</Link></div>
          </div>
          {recordsOpen && (
            <div className="grid gap-px border-t border-[#f0ebe6] bg-[#eee8e3] sm:grid-cols-2 xl:grid-cols-[repeat(4,1fr)_auto]">
              {workEntries.filter((entry) => [1,3,5,7].includes(entry.id)).map((entry) => { const tone = toneStyles[entry.tone]; return (
                <Link key={entry.id} to="/list?boardId=4" className="flex min-h-[92px] items-center gap-3 bg-white px-5 py-4 no-underline hover:bg-[#fffaf6]"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone.badge}`}>✓</span><span className="min-w-0"><span className="block text-[10px] text-[#99948f]">{entry.time}</span><strong className="mt-1 block truncate text-xs text-[#2b3443]">{entry.title}</strong><span className="mt-1 block truncate text-[10px] text-[#777a80]">{entry.detail}</span></span></Link>
              ); })}
              <div className="flex min-h-[72px] flex-col items-center justify-center gap-2 bg-white px-5 xl:min-w-[160px]"><Link to="/write" className="rounded-lg bg-[#d95d3b] px-5 py-3 text-xs font-bold text-white no-underline shadow-sm hover:bg-[#c95032]">☼ 하루 마무리</Link><button type="button" className="text-[10px] text-[#8a8782] hover:text-[#d95d3b]">✦ 기록 정리 도움</button></div>
            </div>
          )}
        </section>
        <p className="mt-6 text-center font-serif text-xs tracking-wide text-[#88837c]"><span className="mr-2 text-[#d95635]">❦</span> 작은 기록이 쌓여, 더 나은 업무 흐름을 만듭니다.</p>
      </main>
    </div>
  );
}

export default Home;
