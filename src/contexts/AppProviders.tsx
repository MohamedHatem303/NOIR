import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

// ===== Theme =====
type Theme = "dark" | "light";
interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

// ===== Language =====
type Lang = "en" | "ar";
interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}
const LangContext = createContext<LangCtx>({
  lang: "en",
  toggle: () => {},
  t: (k) => k,
  dir: "ltr",
});
export const useLang = () => useContext(LangContext);

const translations: Record<string, { en: string; ar: string }> = {
  brand: { en: "Noir", ar: "نوار" },
  tagline: { en: "A Cinematic Dining Experience", ar: "تجربة طعام سينمائية" },
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.about": { en: "About", ar: "عن المطعم" },
  "nav.contact": { en: "Contact", ar: "تواصل" },
  "hero.title": {
    en: "Where Every Plate Tells a Story",
    ar: "حيث يحكي كل طبق قصة",
  },
  "hero.subtitle": {
    en: "An intimate kitchen of fire, craft, and quiet luxury — open every evening.",
    ar: "مطبخ حميمي من النار والحرفية والفخامة الهادئة — مفتوح كل مساء.",
  },
  "hero.cta": { en: "Open the Menu", ar: "افتح القائمة" },
  "hero.reserve": { en: "Reserve a Table", ar: "احجز طاولة" },
  "about.eyebrow": { en: "Our Philosophy", ar: "فلسفتنا" },
  "about.title": {
    en: "Crafted in shadow, served in gold.",
    ar: "صُنعت في الظل، تُقدّم بالذهب.",
  },
  "about.body": {
    en: "Noir is a candle-lit refuge for those who treat dinner as ceremony. Our chefs source slowly, season patiently, and cook with one rule: nothing leaves the pass unless it would bring us joy.",
    ar: "نوار ملاذ مضاء بالشموع لمن يعاملون العشاء كطقس. يختار طهاتنا المكونات ببطء، ويتبلون بصبر، ويطبخون بقاعدة واحدة: لا يخرج طبق من المطبخ ما لم يبهجنا.",
  },
  "about.years": { en: "Years of Craft", ar: "سنوات من الإتقان" },
  "about.dishes": { en: "Signature Dishes", ar: "أطباق مميزة" },
  "about.awards": { en: "Awards", ar: "جوائز" },
  "footer.visit": { en: "Visit Us", ar: "زورونا" },
  "footer.hours": { en: "Hours", ar: "ساعات العمل" },
  "footer.follow": { en: "Follow", ar: "تابعونا" },
  "footer.address": {
    en: "Mansoura El-Gaish St Mogama Al Mahakm",
    ar: "المنصورة ش الجيش مجمع المحاكم",
  },
  "footer.phone": { en: "+20 1110550523", ar: "+٢٠ ١١١٠٥٥٠٥٢٣" },
  "footer.daily": { en: "Daily · 6 PM – Midnight", ar: "يومياً · ٦ مساءً – منتصف الليل" },
  "footer.rights": { en: "All rights reserved | Designed and Developed by Eng MohamedHatem.", ar: "جميع الحقوق محفوظة| مصمم وطوره المهندس محمد حاتم." },
  loading: { en: "Setting the table", ar: "نُعدّ الطاولة" },
  "menu.title": { en: "The Menu", ar: "القائمة" },
  "menu.subtitle": {
    en: "Drag a corner — or use the arrows — to turn the page.",
    ar: "اسحب الزاوية — أو استخدم الأسهم — لقلب الصفحة.",
  },
  "menu.back": { en: "Back to Home", ar: "العودة للرئيسية" },
  "menu.prev": { en: "Previous", ar: "السابق" },
  "menu.next": { en: "Next", ar: "التالي" },
  "menu.page": { en: "Page", ar: "صفحة" },
  "menu.of": { en: "of", ar: "من" },
  "menu.jump": { en: "Jump to", ar: "انتقل إلى" },
  "audio.on": { en: "Music on", ar: "الموسيقى مفعلة" },
  "audio.off": { en: "Music off", ar: "الموسيقى متوقفة" },
  "cat.pizza": { en: "Pizza", ar: "بيتزا" },
  "cat.pasta": { en: "Pasta", ar: "باستا" },
  "cat.grill": { en: "Grill", ar: "مشاوي" },
  "cat.sandwiches": { en: "Sandwiches", ar: "ساندويتشات" },
  "cat.burgers": { en: "Burgers", ar: "برغر" },
  "cat.desserts": { en: "Desserts", ar: "حلويات" },
  "cat.cover": { en: "The Menu", ar: "القائمة" },
  "cat.cover.sub": { en: "Est. 2014 · Chef's Selection", ar: "تأسس ٢٠١٤ · اختيار الشيف" },
  "cat.back": { en: "Thank you", ar: "شكراً لكم" },
  "cat.back.sub": { en: "We hope you dine with us soon.", ar: "نتمنى أن نراكم قريباً." },
};

// ===== Audio =====
interface AudioCtx {
  muted: boolean;
  isMusicPlaying: boolean;
  toggleMute: () => void;
  toggleMusic: () => void;
  playHover: () => void;
  playFlip: () => void;
}

const AudioReactContext = createContext<AudioCtx>({
  muted: true,
  isMusicPlaying: false,
  toggleMute: () => {},
  toggleMusic: () => {},
  playHover: () => {},
  playFlip: () => {},
});

export const useAudio = () => useContext(AudioReactContext);

function useAudioEngine() {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const hoverCtxRef = useRef<AudioContext | null>(null);

  const [muted, setMuted] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const ensureHoverCtx = useCallback(() => {
    if (!hoverCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      hoverCtxRef.current = new Ctx();
    }

    if (hoverCtxRef.current.state === "suspended") {
      hoverCtxRef.current.resume();
    }

    return hoverCtxRef.current;
  }, []);

  useEffect(() => {
    const music = new Audio("/sound/Music.mp3");
    music.loop = true;
    music.preload = "auto";
    music.volume = 0.5;
    musicRef.current = music;

    const handlePlay = () => {
      setIsMusicPlaying(true);
      setMuted(false);
    };

    const handlePause = () => {
      setIsMusicPlaying(false);
      setMuted(true);
    };

    const handleEnded = () => {
      setIsMusicPlaying(false);
      setMuted(true);
    };

    music.addEventListener("play", handlePlay);
    music.addEventListener("pause", handlePause);
    music.addEventListener("ended", handleEnded);

    music.play().catch(() => {
      setIsMusicPlaying(false);
      setMuted(true);
    });

    return () => {
      music.removeEventListener("play", handlePlay);
      music.removeEventListener("pause", handlePause);
      music.removeEventListener("ended", handleEnded);
      music.pause();
      music.src = "";
      musicRef.current = null;
    };
  }, []);

  const toggleMusic = useCallback(async () => {
    const music = musicRef.current;
    if (!music) return;

    if (music.paused) {
      try {
        await music.play();
        setIsMusicPlaying(true);
        setMuted(false);
      } catch {
        setIsMusicPlaying(false);
      }
    } else {
      music.pause();
      setIsMusicPlaying(false);
      setMuted(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    toggleMusic();
  }, [toggleMusic]);

  const playHover = useCallback(() => {
    try {
      const ctx = ensureHoverCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.value = 0;

      oscillator.connect(gain).connect(ctx.destination);

      const now = ctx.currentTime;
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      oscillator.start(now);
      oscillator.stop(now + 0.14);
    } catch {
      // no-op
    }
  }, [ensureHoverCtx]);

  const playFlip = useCallback(() => {}, []);

  return {
    muted,
    isMusicPlaying,
    toggleMute,
    toggleMusic,
    playHover,
    playFlip,
  };
}

// ===== Provider =====
export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("theme") as Theme) || "dark";
    } catch {
      return "dark";
    }
  });

  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("lang") as Lang) || "en";
    } catch {
      return "en";
    }
  });

  const audio = useAudioEngine();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // no-op
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";

    try {
      localStorage.setItem("lang", lang);
    } catch {
      // no-op
    }
  }, [lang]);

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
    [lang]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      }}
    >
      <LangContext.Provider
        value={{
          lang,
          toggle: () => setLang((prev) => (prev === "en" ? "ar" : "en")),
          t,
          dir: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        <AudioReactContext.Provider value={audio}>
          {children}
        </AudioReactContext.Provider>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}