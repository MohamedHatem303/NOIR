import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/AppProviders";

export function Loader({ show }: { show: boolean }) {
  const { t } = useLang();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-noir px-4"
        >
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 text-center sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="ornament text-[10px] tracking-[0.35em] text-gold sm:text-xs"
            >
              ✦ ✦ ✦
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.35em" }}
              animate={{ opacity: 1, letterSpacing: "0.18em" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="font-serif text-3xl uppercase leading-none text-paper sm:text-5xl md:text-6xl"
              style={{ color: "hsl(var(--paper))" }}
            >
              <span className="block sm:inline">Noir</span>{" "}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-px w-28 origin-center bg-gradient-to-r from-transparent via-gold to-transparent sm:w-40"
            />

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-[10px] uppercase tracking-[0.28em] text-paper/70 sm:text-xs sm:tracking-[0.4em]"
              style={{ color: "hsl(var(--paper) / 0.7)" }}
            >
              {t("loading")}…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}