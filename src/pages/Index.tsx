import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import { TopBar } from "@/components/TopBar";
import { useAudio, useLang } from "@/contexts/AppProviders";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: d, ease: [0.22, 1, 0.36, 1] as any } }),
};

const Index = () => {
  const { t, dir } = useLang();
  const { playHover } = useAudio();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <TopBar />

      {/* HERO */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          src={heroImg}
          alt="Candle-lit fine dining table with wagyu, truffle pasta and wood-fired pizza"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0)_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4} className="ornament mb-6 text-xs text-gold">
            ✦ ✦ ✦
          </motion.div>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
            className="mb-4 text-[10px] uppercase tracking-[0.6em] text-gold/80 md:text-xs"
          >
            {t("tagline")}
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={0.8}
            className="font-serif text-5xl font-light leading-[1.05] text-white md:text-7xl lg:text-8xl"
            style={{ color: "white" }}
          >
            {t("hero.title").split(" ").slice(0, -2).join(" ")}{" "}
            <span className="gold-text italic">{t("hero.title").split(" ").slice(-2).join(" ")}</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={1.1}
            className="mt-6 max-w-xl text-base text-white/70 md:text-lg"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1.4} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              onMouseEnter={playHover}
              className="group inline-flex items-center gap-3 rounded-none border border-gold bg-gold px-8 py-4 text-xs uppercase tracking-[0.3em] text-noir transition-all hover:bg-transparent hover:text-gold"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <a
              href="#about"
              onMouseEnter={playHover}
              className="inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-xs uppercase tracking-[0.3em] text-white/80 transition-all hover:border-gold hover:text-gold"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {t("hero.reserve")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
            <div className="h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img src={aboutImg} alt="Candle-lit dining room interior" loading="lazy" width={1280} height={896} className="aspect-[4/5] w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-gold">{t("about.eyebrow")}</p>
            <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              {t("about.title")}
            </h2>
            <div className="hairline my-8 max-w-[6rem]" />
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("about.body")}
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 border-y border-border/60 py-8">
              {[
                { v: "11", k: t("about.years") },
                { v: "42", k: t("about.dishes") },
                { v: "07", k: t("about.awards") },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-serif text-3xl text-gold md:text-4xl">{s.v}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.k}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/50 bg-noir/95 text-paper" style={{ color: "hsl(var(--paper))" }}>
        <div className="container mx-auto grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
          <div className="md:col-span-1">
            <div className="font-serif text-2xl tracking-[0.25em]">
              NOIR 
            </div>
            <p className="mt-4 text-sm opacity-70">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">{t("footer.visit")}</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> {t("footer.address")}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold" /> {t("footer.phone")}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">{t("footer.hours")}</h4>
            <p className="flex items-center gap-2 text-sm opacity-80"><Clock className="h-3.5 w-3.5 text-gold" /> {t("footer.daily")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">{t("footer.follow")}</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mohamed_hatem.303/" onMouseEnter={playHover} className="flex h-10 w-10 items-center justify-center border border-paper/20 transition-colors hover:border-gold hover:text-gold"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-paper/10 py-6 text-center text-[10px] uppercase tracking-[0.3em] opacity-60">
          © {new Date().getFullYear()} Noir · {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
};

export default Index;
