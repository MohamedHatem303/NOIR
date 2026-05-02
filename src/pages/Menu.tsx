import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { SpreadPage } from "@/components/menu/SpreadPage";
import { BOOK_PAGES, CATEGORIES } from "@/data/menu";
import { useAudio, useLang } from "@/contexts/AppProviders";

const menuPages = BOOK_PAGES.filter(
  (p) => p.type === "category-left" || p.type === "category-right"
);

const BOOK_CSS = `
  .menu-book .stf__shadow {
    background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.6)) !important;
  }
`;

/* ─────────────────────────────────────────
   Pinch-to-zoom + pan hook (focus mode فقط)
   ───────────────────────────────────────── */
function usePinchZoom(enabled: boolean) {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const scaleRef     = useRef(1);
  const txRef        = useRef(0);
  const tyRef        = useRef(0);
  const initDistRef  = useRef(0);
  const initScaleRef = useRef(1);
  const initTxRef    = useRef(0);
  const initTyRef    = useRef(0);
  const panStartRef  = useRef<{ x: number; y: number } | null>(null);

  const applyTransform = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform       = `translate(${txRef.current}px,${tyRef.current}px) scale(${scaleRef.current})`;
    el.style.transformOrigin = "center center";
  }, []);

  const clamp = useCallback((s: number, tx: number, ty: number) => {
    const mx = ((s - 1) * window.innerWidth)  / 2;
    const my = ((s - 1) * window.innerHeight) / 2;
    return {
      tx: Math.max(-mx, Math.min(mx, tx)),
      ty: Math.max(-my, Math.min(my, ty)),
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = wrapRef.current;
    if (!el) return;

    const dist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mid = (t: TouchList) => ({
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    });

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initDistRef.current  = dist(e.touches);
        initScaleRef.current = scaleRef.current;
        initTxRef.current    = txRef.current;
        initTyRef.current    = tyRef.current;
        panStartRef.current  = null;
      } else if (e.touches.length === 1 && scaleRef.current > 1) {
        panStartRef.current = {
          x: e.touches[0].clientX - txRef.current,
          y: e.touches[0].clientY - tyRef.current,
        };
      }
    };

    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const ratio    = dist(e.touches) / initDistRef.current;
        const newScale = Math.max(1, Math.min(4, initScaleRef.current * ratio));
        scaleRef.current = newScale;
        const m = mid(e.touches);
        const { tx, ty } = clamp(
          newScale,
          initTxRef.current + (m.x - window.innerWidth  / 2) * (1 - ratio),
          initTyRef.current + (m.y - window.innerHeight / 2) * (1 - ratio),
        );
        txRef.current = tx;
        tyRef.current = ty;
        applyTransform();
      } else if (e.touches.length === 1 && panStartRef.current && scaleRef.current > 1) {
        e.preventDefault();
        const { tx, ty } = clamp(
          scaleRef.current,
          e.touches[0].clientX - panStartRef.current.x,
          e.touches[0].clientY - panStartRef.current.y,
        );
        txRef.current = tx;
        tyRef.current = ty;
        applyTransform();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) panStartRef.current = null;
      if (scaleRef.current <= 1.05) {
        scaleRef.current = 1; txRef.current = 0; tyRef.current = 0;
        applyTransform();
      }
    };

    let lastTap = 0;
    const onTap = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const now = Date.now();
      if (now - lastTap < 280) {
        scaleRef.current = scaleRef.current > 1 ? 1 : 2.2;
        txRef.current = 0; tyRef.current = 0;
        el.style.transition = "transform 0.3s ease";
        applyTransform();
        setTimeout(() => { el.style.transition = ""; }, 320);
      }
      lastTap = now;
    };

    el.addEventListener("touchstart", onStart, { passive: true  });
    el.addEventListener("touchstart", onTap,   { passive: true  });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true  });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchstart", onTap);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [enabled, applyTransform, clamp]);

  const reset = useCallback(() => {
    scaleRef.current = 1; txRef.current = 0; tyRef.current = 0;
    if (wrapRef.current) wrapRef.current.style.transform = "";
  }, []);

  return { wrapRef, reset };
}

/* ─── حساب حجم الكتاب ─── */
function useBookSize() {
  const [size, setSize] = useState({ w: 380, h: 480 });
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 640) {
        const reservedV = 52 + 52 + 44 + 72;
        const availH    = vh - reservedV;
        const w         = Math.floor((vw - 2) / 2);
        const h         = Math.min(Math.round(w * 1.45), availH);
        setSize({ w: Math.max(w, 100), h: Math.max(h, 140) });
      } else {
        const maxPageW = Math.floor((vw * 0.97) / 2);
        let h = Math.min(vh - 180, 900);
        let w = Math.round(h * 0.85);
        if (w > maxPageW) { w = maxPageW; h = Math.round(w / 0.85); }
        setSize({ w: Math.max(w, 160), h: Math.max(h, 200) });
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return size;
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function Menu() {
  const { t, dir, lang } = useLang();
  const { playHover }    = useAudio();
  const bookRef          = useRef<any>(null);
  const { w, h }         = useBookSize();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isMobile, setIsMobile]           = useState(() => window.innerWidth < 640);
  const [focusMode, setFocusMode]         = useState(false);
  const { wrapRef, reset }                = usePinchZoom(focusMode);
  const flipSoundRef                      = useRef<HTMLAudioElement | null>(null);

  /* preload صوت التقليب */
  useEffect(() => {
    const audio = new Audio("/sound/page_flip.mp3");
    audio.preload = "auto";
    flipSoundRef.current = audio;
  }, []);

  const playFlipSound = useCallback(() => {
    const s = flipSoundRef.current;
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
  }, []);

  const onFlip = useCallback((e: any) => {
    playFlipSound();
    setCurrentSpread(Math.floor(e.data / 2));
  }, [playFlipSound]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* منع scroll الصفحة كلها على الموبيل */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  const exitFocus = useCallback(() => { reset(); setFocusMode(false); }, [reset]);

  const goToCategory = (i: number) =>
    bookRef.current?.pageFlip()?.flip(i * 2);

  /* ── الصفحات ── */
  const pages = CATEGORIES.flatMap((_, index) => [
    <SpreadPage key={`L-${index}`} categoryIndex={index} isLeft={true}  />,
    <SpreadPage key={`R-${index}`} categoryIndex={index} isLeft={false} />,
  ]);

  /* ══════════════════════════
     FOCUS MODE
     ══════════════════════════ */
  if (focusMode) {
    const fw = Math.floor((window.innerWidth  - 2) / 2);
    const fh = Math.min(Math.round(fw * 1.45), window.innerHeight - 32);

    return (
      <>
        <style>{BOOK_CSS}</style>

        <div
          style={{
            position: "fixed", inset: 0,
            background: "#050403",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 50,
          }}
          dir={dir}
        >
          {/* pinch-zoom wrapper */}
          <div
            ref={wrapRef}
            style={{ display: "inline-block", willChange: "transform", touchAction: "none" }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={fw} height={fh}
              size="fixed"
              minWidth={80} maxWidth={1100} minHeight={100} maxHeight={1100}
              showCover={false}
              mobileScrollSupport={true}
              drawShadow={true} maxShadowOpacity={0.35}
              flippingTime={950}
              usePortrait={false} autoSize={false}
              clickEventForward={false} useMouseEvents={true}
              swipeDistance={15} showPageCorners={true} disableFlipByClick={false}
              startPage={currentSpread * 2}
              className="menu-book"
              onFlip={onFlip}
            >
              {pages}
            </HTMLFlipBook>
          </div>

          {/* زرار الخروج */}
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: dir === "rtl" ? "auto" : "10px",
              left:  dir === "rtl" ? "10px"  : "auto",
              zIndex: 60,
              display: "flex", flexDirection: "column",
              alignItems: dir === "rtl" ? "flex-start" : "flex-end",
              gap: "6px",
            }}
          >
            <button
              onClick={exitFocus}
              aria-label="Exit focus mode"
              style={{
                width: "30px", height: "30px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(10,9,7,0.85)",
                border: "1px solid rgba(202,169,95,0.30)",
                borderRadius: "6px",
                color: "rgba(202,169,95,0.75)",
                cursor: "pointer", touchAction: "manipulation",
                backdropFilter: "blur(4px)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
            <p style={{ fontSize: "8px", color: "rgba(202,169,95,0.28)", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
              pinch · double-tap
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════
     NORMAL MODE
     ══════════════════════════ */
  return (
    <>
      <style>{BOOK_CSS}</style>

      <div
        className="relative h-screen overflow-hidden flex flex-col bg-[#070606] text-foreground"
        dir={dir}
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#070606] to-black/95" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
        </div>

        <TopBar variant="menu" />

        <div className="relative z-10 flex flex-col flex-1 pt-[52px] min-h-0">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 pt-2 pb-1 shrink-0"
          >
            <p className="text-[9px] uppercase tracking-[0.55em] text-gold/80">{t("brand")}</p>
            <h1 className="mt-1 font-serif text-xl uppercase tracking-[0.08em] text-paper md:text-3xl">
              {t("menu.title")}
            </h1>
          </motion.div>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-1.5 px-3 pb-2 shrink-0"
          >
            {CATEGORIES.map((c, i) => {
              const active = currentSpread === i;
              return (
                <button
                  key={c.id}
                  onMouseEnter={playHover}
                  onClick={() => goToCategory(i)}
                  className={`group relative rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.28em] transition-all md:text-[9px] md:px-3 ${
                    active
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-border/50 text-muted-foreground hover:border-gold/40 hover:text-paper"
                  }`}
                >
                  {t(c.key)}
                  <span className={`absolute inset-x-2 -bottom-0.5 h-px origin-center bg-gold transition-transform ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </button>
              );
            })}
          </motion.div>

          {/*
            Book container:
            - موبيل: shrink-0 ← بياخد حجم الكتاب بالظبط، مفيش فراغ
            - desktop: flex-1 min-h-0 ← يملأ المساحة ويتوسط رأسياً
          */}
          <div className="shrink-0 md:flex-1 md:min-h-0 flex justify-center items-center pt-1 md:pt-0">
            <motion.div
              key={`${lang}-${w}-${h}`}
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(202,169,95,0.06))" }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={w} height={h}
                size="fixed"
                minWidth={80} maxWidth={1100} minHeight={100} maxHeight={1100}
                showCover={false}
                mobileScrollSupport={true}
                drawShadow={true} maxShadowOpacity={0.35}
                flippingTime={950}
                usePortrait={false} autoSize={false}
                clickEventForward={false} useMouseEvents={true}
                swipeDistance={15} showPageCorners={true} disableFlipByClick={false}
                startPage={0}
                className="menu-book"
                onFlip={onFlip}
              >
                {pages}
              </HTMLFlipBook>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="shrink-0 flex flex-col items-center gap-2 px-4 py-3"
          >
            {/* hint التقليب — فوق الزرارين، موبيل فقط */}
            {isMobile && (
              <p
                style={{
                  fontSize: "8px",
                  color: "rgba(202,169,95,0.38)",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  lineHeight: 1.6,
                  userSelect: "none",
                }}
              >
                {lang === "ar"
                  ? "اسحب يميناً أو يساراً لتقليب الكتاب او انقر على حافة الصفحة لجلب الصفحة التالية أو السابقة"
                  : "Swipe left or right to flip or tap a page edge to go to the next or previous page"}
              </p>
            )}

            {/* الزرارين */}
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/"
                onMouseEnter={playHover}
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.32em] text-muted-foreground transition-colors hover:text-gold"
              >
                <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
                {t("menu.back")}
              </Link>

              {/* زرار Focus Mode — موبيل فقط */}
              {isMobile && (
                <button
                  onClick={() => setFocusMode(true)}
                  aria-label="Focus mode"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "28px", height: "28px",
                    border: "1px solid rgba(202,169,95,0.35)",
                    borderRadius: "4px",
                    background: "rgba(202,169,95,0.06)",
                    color: "rgba(202,169,95,0.7)",
                    cursor: "pointer", flexShrink: 0, touchAction: "manipulation",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 4.5V1H4.5M8.5 1H12V4.5M12 8.5V12H8.5M4.5 12H1V8.5"
                          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}