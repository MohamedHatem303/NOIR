import { forwardRef } from "react";
import { CATEGORIES, MenuItem } from "@/data/menu";
import { useLang } from "@/contexts/AppProviders";

interface Props {
  categoryIndex: number;
  isLeft: boolean;
}

function Item({ item, lang }: { item: MenuItem; lang: "en" | "ar" }) {
  return (
    <div className="flex gap-2 items-start">
      {/* صورة الـ item */}
      <div className="relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.name[lang]}
          className="object-cover rounded-md shadow-lg"
          style={{
            width:  "clamp(44px, 16vw, 80px)",
            height: "clamp(44px, 16vw, 80px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(202,169,95,0.22)" }}
        />
      </div>

      {/* النص */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-baseline gap-1 flex-wrap">
          <h4
            className="font-serif uppercase tracking-wide text-white leading-tight"
            style={{ fontSize: "clamp(7.5px, 2.6vw, 13px)" }}
          >
            {item.name[lang]}
          </h4>
          <div
            className="flex-1 min-w-[6px]"
            style={{
              borderBottom: "1px dotted rgba(202,169,95,0.28)",
              marginBottom: "3px",
            }}
          />
          <span
            className="text-yellow-500 font-medium whitespace-nowrap"
            style={{ fontSize: "clamp(7.5px, 2.6vw, 13px)" }}
          >
            ${item.price}
          </span>
        </div>
        <p
          className="mt-0.5 text-gray-400 leading-snug line-clamp-2"
          style={{ fontSize: "clamp(6.5px, 2vw, 10px)" }}
        >
          {item.desc[lang]}
        </p>
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const paths: Record<string, string> = {
    tl: "M0 16 L0 0 L16 0",
    tr: "M16 16 L16 0 L0 0",
    bl: "M0 0 L0 16 L16 16",
    br: "M16 0 L16 16 L0 16",
  };
  const positions: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...positions[pos],
        width:  "clamp(10px, 3vw, 20px)",
        height: "clamp(10px, 3vw, 20px)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none">
        <path d={paths[pos]} stroke="rgba(202,169,95,0.62)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export const SpreadPage = forwardRef<HTMLDivElement, Props>(
  ({ categoryIndex, isLeft }, ref) => {
    const { t, lang } = useLang();
    const cat = CATEGORIES[categoryIndex];
    const items = isLeft ? cat.items.slice(0, 2) : cat.items.slice(2, 4);
    const pageLabel = isLeft ? "I" : "II";

    return (
      <div
        ref={ref}
        className="h-full w-full flex items-stretch"
        style={{
          background: "#0d0c0a",
          padding: "clamp(4px, 1.5vw, 14px)",
        }}
      >
        <div
          className="flex-1 flex flex-col relative"
          style={{
            background:
              "linear-gradient(148deg, #121009 0%, #0d0c0a 50%, #0f0d0b 100%)",
            border: "1px solid rgba(202,169,95,0.30)",
            borderRadius: "3px",
            padding: "clamp(7px, 2.5vw, 24px)",
            overflow: "hidden",
          }}
        >
          {/* بوردر داخلي */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "4px",
              border: "1px solid rgba(202,169,95,0.06)",
              borderRadius: "2px",
            }}
          />

          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* HEADER */}
          <div
            className="flex items-end justify-between shrink-0"
            style={{
              borderBottom: "1px solid rgba(202,169,95,0.16)",
              paddingBottom: "clamp(4px, 1.5vw, 12px)",
              marginBottom: "clamp(4px, 1.5vw, 14px)",
            }}
          >
            <div>
              <p
                className="uppercase mb-0.5"
                style={{
                  fontSize: "clamp(5px, 1.4vw, 8.5px)",
                  letterSpacing: "0.4em",
                  color: "rgba(202,169,95,0.48)",
                }}
              >
                Noir
              </p>
              <h2
                className="font-serif leading-none"
                style={{
                  fontSize: "clamp(12px, 3.8vw, 28px)",
                  color: "#CAA95F",
                }}
              >
                {t(cat.key)}
              </h2>
            </div>
            <span
              className="font-serif italic"
              style={{
                fontSize: "clamp(9px, 2.2vw, 15px)",
                color: "rgba(202,169,95,0.38)",
              }}
            >
              {pageLabel}
            </span>
          </div>

          {/* ITEMS — كل item بارتفاع ثابت وmit overflow */}
          <div
            className="shrink-0 flex flex-col"
            style={{ gap: "clamp(5px, 2vw, 16px)" }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  height: "clamp(54px, 20vw, 96px)",
                  overflow: "hidden",
                }}
              >
                <Item item={item} lang={lang} />
              </div>
            ))}
          </div>

          {/* SPACER — يملأ الفراغ المتبقي */}
          <div className="flex-1" />

          {/* FOOTER */}
          <div
            className="shrink-0 text-center"
            style={{
              borderTop: "1px solid rgba(202,169,95,0.09)",
              paddingTop: "clamp(3px, 1vw, 8px)",
              marginTop: "clamp(3px, 1vw, 10px)",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "clamp(5px, 1.3vw, 8px)",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.11)",
              }}
            >
              Est. 2014 · Chef's Selection
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SpreadPage.displayName = "SpreadPage";