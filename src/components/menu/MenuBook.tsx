import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { SpreadPage } from "./SpreadPage";
import { CATEGORIES } from "@/data/menu";
import { useLang } from "@/contexts/AppProviders";

/* ─────────────────────────────────────────────
   CSS آمن — بس visual، بدون أي تعديل على transform
   ────────────────────────────────────────────── */
const FLIP_STYLE = `
  /* ظل التقليب — أغمق شوية */
  .nob-book .stf__shadow {
    background: linear-gradient(
      to right,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0.55) 100%
    ) !important;
  }
  /* منع أي overflow يقطع الصفحة */
  .nob-book .stf__parent {
    overflow: visible !important;
  }
`;

/* ─── NAV BUTTON ─── */
function NavBtn({
  dir,
  onClick,
  disabled,
  label,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 20px",
        background: disabled ? "transparent" : "rgba(202,169,95,0.08)",
        border: `1px solid ${disabled ? "rgba(202,169,95,0.12)" : "rgba(202,169,95,0.40)"}`,
        borderRadius: "2px",
        color: disabled ? "rgba(202,169,95,0.25)" : "rgba(202,169,95,0.85)",
        fontSize: "11px",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(202,169,95,0.15)";
      }}
      onMouseLeave={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(202,169,95,0.08)";
      }}
    >
      {dir === "prev" && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      {label}
      {dir === "next" && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

/* ─── حساب الحجم ─── */
const NAV_H = 64; // ارتفاع شريط الأزرار
const PAGE_GAP = 24; // مسافة بين الكتاب والأزرار

function useBookSize() {
  const [size, setSize] = useState({ w: 420, h: 580, portrait: false });

  const calc = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;

    // المساحة الرأسية المتاحة للكتاب (بدون الأزرار)
    const availH = vh - NAV_H - PAGE_GAP - 32; // 32 = margin فوق وتحت

    if (isMobile) {
      // Portrait — صفحة واحدة
      const w = Math.min(vw - 16, 420);
      const h = Math.min(Math.floor(w * 1.32), availH);
      setSize({ w, h, portrait: true });
    } else {
      /*
        Desktop:
        - نستغل 96% من عرض الشاشة للكتاب (صفحتين)
        - نسبة الصفحة: 0.75 (أعرض من قبل)
        - pageW * 2 <= maxBookW
      */
      const maxBookW = vw * 0.96;

      // ابدأ من الارتفاع المتاح
      let pageH = Math.min(availH, 820);
      let pageW = Math.floor(pageH * 0.75);

      // لو الكتاب أعرض من الشاشة → قلص من العرض
      if (pageW * 2 > maxBookW) {
        pageW = Math.floor(maxBookW / 2);
        pageH = Math.floor(pageW / 0.75);
      }

      setSize({ w: pageW, h: pageH, portrait: false });
    }
  }, []);

  useEffect(() => {
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [calc]);

  return size;
}

/* ─── MAIN ─── */
export default function MenuBook() {
  const bookRef = useRef<any>(null);
  const { w, h, portrait } = useBookSize();
  const { t } = useLang();

  const totalSpreads = CATEGORIES.length; // كل spread = صفحتين
  const totalPages   = totalSpreads * 2;  // عدد الصفحات الكلي

  const [currentPage, setCurrentPage] = useState(0);

  const pages = CATEGORIES.flatMap((_, index) => [
    { categoryIndex: index, isLeft: true,  key: `L-${index}` },
    { categoryIndex: index, isLeft: false, key: `R-${index}` },
  ]);

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev("top");
  }, []);

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext("top");
  }, []);

  // react-pageflip على desktop يقلب بخطوتين (صفحتين دفعة)
  const isFirst = currentPage === 0;
  const isLast  = portrait
    ? currentPage >= totalPages - 1
    : currentPage >= totalPages - 2;

  /* spread indicator */
  const spreadIndex  = portrait ? currentPage : Math.floor(currentPage / 2);
  const spreadLabel  = `${spreadIndex + 1} / ${totalSpreads}`;

  return (
    <>
      <style>{FLIP_STYLE}</style>

      {/* ── الـ container الكلي — flex column وسط الشاشة ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          background: "#050403",
          gap: PAGE_GAP,
          padding: "16px 0",
        }}
      >

        {/* ── الكتاب ── */}
        <div
          style={{
            position: "relative",
            width:  portrait ? w : w * 2,
            height: h,
            filter:
              "drop-shadow(0 12px 48px rgba(202,169,95,0.14)) " +
              "drop-shadow(0 2px 16px rgba(0,0,0,0.9))",
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={w}
            height={h}
            size="fixed"
            minWidth={200}
            maxWidth={1000}
            minHeight={260}
            maxHeight={1100}
            showCover={false}
            mobileScrollSupport={true}
            usePortrait={portrait}
            drawShadow={true}
            flippingTime={950}
            className="nob-book"
            startPage={0}
            swipeDistance={25}
            clickEventForward={false}   // ← مهم: نمنع click عشان ما يتعارضش مع الأزرار
            onFlip={(e: any) => setCurrentPage(e.data)}
          >
            {pages.map(({ categoryIndex, isLeft, key }) => (
              <SpreadPage
                key={key}
                categoryIndex={categoryIndex}
                isLeft={isLeft}
              />
            ))}
          </HTMLFlipBook>

          {/* Spine — خط المنتصف على desktop */}
          {!portrait && (
            <div
              style={{
                position: "absolute",
                top: "5%",
                bottom: "5%",
                left: "50%",
                width: "1px",
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(to bottom, transparent, rgba(202,169,95,0.4) 20%, rgba(202,169,95,0.4) 80%, transparent)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* ── شريط التنقل (دايماً تحت الكتاب، مش فوقيه) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            height: NAV_H,
          }}
        >
          <NavBtn
            dir="prev"
            onClick={goPrev}
            disabled={isFirst}
            label={t("menu.prev")}
          />

          {/* مؤشر الصفحة */}
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "rgba(202,169,95,0.45)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "60px",
              textAlign: "center",
            }}
          >
            {spreadLabel}
          </span>

          <NavBtn
            dir="next"
            onClick={goNext}
            disabled={isLast}
            label={t("menu.next")}
          />
        </div>

      </div>
    </>
  );
}