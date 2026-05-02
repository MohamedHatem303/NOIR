import { motion } from "framer-motion";
import { Volume2, VolumeX, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang, useAudio } from "@/contexts/AppProviders";
import { Button } from "@/components/ui/button";

export function TopBar({ variant = "home" }: { variant?: "home" | "menu" }) {
  const { toggle: toggleLang, t } = useLang();
  const { isMusicPlaying, toggleMusic, playHover } = useAudio();

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 ${
        variant === "menu" ? "bg-background/60 backdrop-blur-md" : ""
      }`}
    >
      <Link
        to="/"
        className="group flex items-center gap-2"
        onMouseEnter={playHover}
      >
        <span className="font-serif text-xl tracking-[0.3em] text-foreground md:text-2xl">
          NOIR
        </span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <Link
          to="/"
          onMouseEnter={playHover}
          className={`text-xs uppercase tracking-[0.3em] transition-colors hover:text-gold ${
            window.location.pathname === "/"
              ? "text-gold"
              : "text-foreground/70"
          }`}
        >
          {t("nav.home")}
        </Link>

        <Link
          to="/menu"
          onMouseEnter={playHover}
          className={`text-xs uppercase tracking-[0.3em] transition-colors hover:text-gold ${
            window.location.pathname === "/menu"
              ? "text-gold"
              : "text-foreground/70"
          }`}
        >
          {t("nav.menu")}
        </Link>
      </nav>

      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLang}
          onMouseEnter={playHover}
          aria-label="Language"
          className="text-foreground/80 hover:text-gold"
        >
          <Languages className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMusic}
          onMouseEnter={playHover}
          aria-label={isMusicPlaying ? t("audio.off") : t("audio.on")}
          className="text-foreground/80 hover:text-gold"
        >
          {isMusicPlaying ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.header>
  );
}