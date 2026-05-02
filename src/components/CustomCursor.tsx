import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }

    let rx = 0,
      ry = 0,
      x = 0,
      y = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      setHovering(
        !!t.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor='hover']"
        )
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-gold transition-opacity duration-200 ${
          hovering ? "opacity-0" : "opacity-100"
        }`}
        style={{
          mixBlendMode: "difference",
          transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      />

      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-gold/60 transition-[width,height,opacity] duration-300 ${
          hovering ? "h-10 w-10 opacity-100" : "h-8 w-8 opacity-70"
        }`}
        style={{
          transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      />
    </>
  );
}