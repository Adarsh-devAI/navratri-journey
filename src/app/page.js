"use client";

/**
 * 9 Days of Navratri — interactive darshan experience
 * ----------------------------------------------------
 * Drop this file in as src/app/page.js in a Next.js (App Router) project.
 *
 * Dependencies to install:
 *   npm install framer-motion lucide-react html-to-image
 *
 * Expected local assets (not included):
 *   /public/images/day-1.jpg … /public/images/day-9.jpg
 *   /public/audio/navratri-dhun.mp3
 * The UI degrades gracefully if either is missing.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  Flame,
  Flower2,
  Moon,
  Pause,
  Play,
  Share2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toPng } from "html-to-image";

/* ------------------------------------------------------------------ */
/*  Content — the nine forms of the Devi                               */
/* ------------------------------------------------------------------ */

const NAVRATRI_DATA = [
  {
    day: 1,
    name: "Maa Shailputri",
    title: "Daughter of the Mountains",
    vahana: "Nandi, the sacred bull",
    attributes: "Trishul & sacred lotus",
    image: "/images/day-1.jpg",
    accent: "#c9693f",
    lesson:
      "Steadfastness and unshakeable strength. Born of the mountains, Shailputri teaches that true power is calm and immovable — like a peak that stands through every storm, season after season.",
    mantra:
      "Vande Vāñchita-lābhāya Chandrārdha-kṛta-śekharām, Vṛṣārūḍhāṃ Śūladharāṃ Śailaputrīṃ Yaśasvinīm.",
    meaning:
      "I bow to Shailputri, the glorious daughter of the mountains, who wears the crescent moon upon her crown, rides the sacred bull Nandi, and carries the trident — granting every wish to those who seek her.",
  },
  {
    day: 2,
    name: "Maa Brahmacharini",
    title: "The Ascetic of Unwavering Vow",
    vahana: "None — she walks the path barefoot",
    attributes: "Japa mala & kamandalu",
    image: "/images/day-2.jpg",
    accent: "#cdb892",
    lesson:
      "Dedication, focus, and peaceful penance. Brahmacharini walks her path of discipline barefoot, a reminder that lasting transformation is built one devoted step at a time.",
    mantra:
      "Dadhānā Kara-padmābhyām Akṣamālā-kamaṇḍalū, Devī Prasīdatu Mayi Brahmachāriṇy-anuttamā.",
    meaning:
      "Holding the rosary and the sacred water-pot in her lotus hands, may the supreme ascetic Brahmacharini be pleased with me and grant her grace.",
  },
  {
    day: 3,
    name: "Maa Chandraghanta",
    title: "The Bell-Bearer, Fierce and Serene",
    vahana: "Tiger or lion",
    attributes: "Ten arms bearing weapons",
    image: "/images/day-3.jpg",
    accent: "#b23a52",
    lesson:
      "Bravery, grace, and the courage to face inner demons. With a bell shaped like the crescent moon on her brow, Chandraghanta shows that fierceness and gentleness can live in the very same heart.",
    mantra:
      "Piṇḍaja-pravarārūḍhā Chaṇḍakopāstra-kairyutā, Prasādaṃ Tanute Mahyaṃ Chandraghaṇṭeti Viśrutā.",
    meaning:
      "Seated gracefully upon her tiger and armed with fierce weapons, Chandraghanta, known for the bell on her crown, bestows her blessings upon me.",
  },
  {
    day: 4,
    name: "Maa Kushmanda",
    title: "The Cosmic Egg, Creator of Light",
    vahana: "Lioness",
    attributes: "Eight arms radiating solar light",
    image: "/images/day-4.jpg",
    accent: "#3f5e99",
    lesson:
      "The power of creative energy and generating light in darkness. Kushmanda's gentle smile is said to have given rise to the universe itself — a reminder that creation begins from a warmth within.",
    mantra:
      "Surāsampūrṇa-kalaśaṃ Rudhirāplutam-eva Cha, Dadhānā Hasta-padmābhyāṃ Kūṣmāṇḍā Śubhadāstu Me.",
    meaning:
      "Holding a vessel brimming with nectar in her lotus hands, the auspicious Kushmanda grants me well-being and strength.",
  },
  {
    day: 5,
    name: "Maa Skandamata",
    title: "Mother of the Warrior Skanda",
    vahana: "Lion",
    attributes: "Cradling infant Skanda & a lotus",
    image: "/images/day-5.jpg",
    accent: "#d9a441",
    lesson:
      "Compassion, pure love, and maternal protection. Cradling her son Skanda, this form of the Devi reveals that the fiercest strength often wears the softest face — a mother's love.",
    mantra:
      "Siṃhāsanagatā Nityaṃ Padmāśrita-karadvayā, Śubhadāstu Sadā Devī Skandamātā Yaśasvinī.",
    meaning:
      "Forever seated upon her lion throne, hands resting gently on the lotus, may the glorious Skandamata, mother of Skanda, be ever auspicious to me.",
  },
  {
    day: 6,
    name: "Maa Katyayani",
    title: "The Warrior Sage's Daughter",
    vahana: "Majestic lion",
    attributes: "Chandrahas sword & lotus",
    image: "/images/day-6.jpg",
    accent: "#3f8f5f",
    lesson:
      "Fierce courage to stand against injustice. Astride her lion with sword raised, Katyayani reminds us that righteous anger, rightly channelled, becomes a force for justice.",
    mantra:
      "Chandrahāsojjvala-karā Śārdūla-vara-vāhanā, Katyāyanī Śubhaṃ Dadyād Devī Dānava-ghātinī.",
    meaning:
      "With the radiant Chandrahas sword in hand and mounted on her mighty lion, Katyayani, who vanquishes evil, grants auspiciousness.",
  },
  {
    day: 7,
    name: "Maa Kalaratri",
    title: "The Dark Night That Ends Fear",
    vahana: "Donkey",
    attributes: "Iron cleaver & thunderbolt",
    image: "/images/day-7.jpg",
    accent: "#6b5b96",
    lesson:
      "Fearlessness and the dissolution of ignorance. In her dark, formidable form, Kalaratri burns away fear itself, so that nothing — not even the night — can hold power over us.",
    mantra:
      "Oṃ Devī Kālarātryai Namaḥ — Dhūmra-varṇā, Bhayānaka-rūpā, Śubhaṅkarī Sadaiva Namostute.",
    meaning:
      "Salutations to Goddess Kalaratri — smoke-hued and fearsome in form, yet eternally auspicious; she who dissolves all fear and darkness.",
  },
  {
    day: 8,
    name: "Maa Mahagauri",
    title: "Radiant in White, Restorer of Purity",
    vahana: "White bull",
    attributes: "White garments, trishul & damru",
    image: "/images/day-8.jpg",
    accent: "#8a52a8",
    lesson:
      "Purity, peace, and the washing away of past sins. Robed in white upon her bull, Mahagauri offers the quiet grace of a fresh beginning.",
    mantra:
      "Śvete Vṛṣe Samārūḍhā Śvetāmbaradharā Śuchiḥ, Mahāgaurī Śubhaṃ Dadyān Mahādeva-pramoda-dā.",
    meaning:
      "Mounted upon a white bull and robed in white, the pure Mahagauri — who brings joy even to Mahadev — grants auspiciousness and peace.",
  },
  {
    day: 9,
    name: "Maa Siddhidatri",
    title: "Giver of Perfection and Grace",
    vahana: "Lion, seated upon a lotus",
    attributes: "Chakra, gada, shankha & lotus",
    image: "/images/day-9.jpg",
    accent: "#c14f82",
    lesson:
      "Achieving ultimate knowledge, perfection, and spiritual awakening. Siddhidatri, granter of every siddhi, marks the final step of the journey — the full blossoming of the soul.",
    mantra:
      "Siddha-gandharva-yakṣādyair Asurair Amarair-api, Sevyamānā Sadā Bhūyāt Siddhidā Siddhidāyinī.",
    meaning:
      "Served always by siddhas, gandharvas, yakshas, asuras and gods alike, may Siddhidatri, the giver of all perfection, bless us with ultimate attainment.",
  },
];

const GOLD = "#e8b464";

function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function NavratriExperience() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [mantraRevealed, setMantraRevealed] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("square"); // "square" | "story"

  const shouldReduceMotion = useReducedMotion();
  const current = NAVRATRI_DATA[selectedDay - 1];

  // Generate background particles only after mount — prevents the
  // server-rendered HTML and the first client render from disagreeing
  // (Math.random() must never run during the initial render pass).
  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 34 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 16 + 12,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.4 + 0.15,
    }));
    setParticles(generated);
  }, []);

  // Reset per-day UI state whenever the selected night changes
  useEffect(() => {
    setImgError(false);
    setMantraRevealed(false);
  }, [selectedDay]);

  const goToDay = (day) => {
    const wrapped = ((day - 1 + 9) % 9) + 1;
    setSelectedDay(wrapped);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn(
            "Playback failed — /audio/navratri-dhun.mp3 may be missing or blocked by the browser:",
            err
          );
          setIsPlaying(false);
        });
    }
  };

  const accentSoft35 = hexToRgba(current.accent, 0.35);
  const accentSoft55 = hexToRgba(current.accent, 0.55);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0617] text-[#f5ecff]">
      {/* ambient glow layers */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl transition-colors duration-700"
        style={{ background: hexToRgba(current.accent, 0.16) }}
      />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#e8b464]/10 blur-3xl" />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl transition-colors duration-700"
        style={{ background: hexToRgba(current.accent, 0.12) }}
      />

      {/* drifting particles — client-only, generated post-mount */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) =>
            shouldReduceMotion ? (
              <span
                key={p.id}
                className="absolute rounded-full bg-[#f3d9a4]"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity,
                }}
              />
            ) : (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-[#f3d9a4]"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  y: [0, -28, 0],
                  opacity: [p.opacity, p.opacity * 1.8, p.opacity],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )
          )}
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Header                                                        */}
      {/* ------------------------------------------------------------ */}
      <header className="relative z-10 px-4 pt-12 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-4 flex items-center justify-center gap-3 text-[#e8b464]/70"
        >
          <Moon className="h-4 w-4" />
          <Star className="h-3 w-3" />
          <Moon className="h-4 w-4 scale-x-[-1]" />
        </motion.div>
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#f8f0ff] sm:text-4xl md:text-5xl">
          Nine Nights of the Devi
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#c9b8e0]/80 sm:text-base">
          A darshan of the nine forms of the Divine Mother, one night at a time.
        </p>
      </header>

      {/* ------------------------------------------------------------ */}
      {/* Day selector                                                  */}
      {/* ------------------------------------------------------------ */}
      <DayRail
        days={NAVRATRI_DATA}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
        onPrev={() => goToDay(selectedDay - 1)}
        onNext={() => goToDay(selectedDay + 1)}
      />

      {/* ------------------------------------------------------------ */}
      {/* Main: Devi showcase (A) + story (B)                           */}
      {/* ------------------------------------------------------------ */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.day}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2"
          >
            {/* -------------------- Side A: the Devi -------------------- */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-sm">
                {/* breathing glow behind the arch */}
                {shouldReduceMotion ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[50%]"
                    style={{ boxShadow: `0 0 55px 15px ${accentSoft35}` }}
                  />
                ) : (
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[50%]"
                    animate={{
                      boxShadow: [
                        `0 0 35px 8px ${accentSoft35}`,
                        `0 0 65px 18px ${accentSoft55}`,
                        `0 0 35px 8px ${accentSoft35}`,
                      ],
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* the arched niche */}
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden border-[3px] bg-gradient-to-b from-white/10 to-transparent"
                  style={{
                    borderRadius: "50% 50% 18px 18px / 30% 30% 18px 18px",
                    borderColor: hexToRgba(current.accent, 0.45),
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-[7px] -z-0"
                    style={{
                      borderRadius: "50% 50% 12px 12px / 30% 30% 12px 12px",
                      border: `1px solid ${hexToRgba(GOLD, 0.35)}`,
                    }}
                  />
                  {!imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.image}
                      alt={current.name}
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#1d0f35] to-[#0b0617] px-6 text-center">
                      <span className="text-5xl text-[#e8b464]/80">ॐ</span>
                      <p className="font-serif text-lg text-[#f5ecff]/90">
                        {current.name}
                      </p>
                      <p className="text-xs text-[#c9b8e0]/60">
                        Her image will appear here once added to
                        /public{current.image}
                      </p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>

                {/* diyas flanking the niche */}
                <motion.div
                  className="absolute -bottom-2 left-3"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flame className="h-5 w-5" style={{ color: GOLD }} />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 right-3"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: [1, 0.5, 1], scale: [1.05, 0.95, 1.05] }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flame className="h-5 w-5" style={{ color: GOLD }} />
                </motion.div>
              </div>

              {/* badges */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Flower2 className="h-4 w-4" style={{ color: current.accent }} />
                  <div className="text-left">
                    <p className="text-[11px] leading-none text-[#c9b8e0]/55">
                      Vahana
                    </p>
                    <p className="text-xs font-medium text-[#f5ecff]">
                      {current.vahana}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Sparkles className="h-4 w-4" style={{ color: current.accent }} />
                  <div className="text-left">
                    <p className="text-[11px] leading-none text-[#c9b8e0]/55">
                      Attributes
                    </p>
                    <p className="text-xs font-medium text-[#f5ecff]">
                      {current.attributes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------- Side B: her story -------------------- */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-[#c9b8e0]/55">
                  <Star className="h-3.5 w-3.5" />
                  Night {current.day} of 9
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#f8f0ff] sm:text-4xl">
                  {current.name}
                </h2>
                <p
                  className="mt-1 font-serif text-lg italic"
                  style={{ color: current.accent }}
                >
                  {current.title}
                </p>
              </div>

              {/* Daily lesson */}
              <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" style={{ color: current.accent }} />
                  <h3 className="text-sm font-semibold text-[#f5ecff]/90">
                    Today's lesson
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#e4d9f5]/85">
                  {current.lesson}
                </p>
              </div>

              {/* Mantra */}
              <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Flame className="h-4 w-4" style={{ color: current.accent }} />
                  <h3 className="text-sm font-semibold text-[#f5ecff]/90">
                    Sacred mantra
                  </h3>
                </div>
                <p className="font-serif text-base italic leading-relaxed text-[#f3d9a4]/90">
                  {current.mantra}
                </p>
                <button
                  onClick={() => setMantraRevealed((v) => !v)}
                  className="mt-4 flex items-center gap-1 text-xs font-medium text-[#c9b8e0]/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60"
                >
                  {mantraRevealed ? "Hide meaning" : "Reveal meaning"}
                  <motion.span
                    animate={{ rotate: mantraRevealed ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {mantraRevealed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-[#e4d9f5]/75">
                        {current.meaning}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Export */}
              <button
                onClick={() => setExportOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{
                  background: `linear-gradient(135deg, ${current.accent}, #4a2f72)`,
                }}
              >
                <Share2 className="h-4 w-4" />
                Export for socials
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ------------------------------------------------------------ */}
      {/* Floating audio control                                        */}
      {/* ------------------------------------------------------------ */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {isPlaying && !shouldReduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: current.accent }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <button
            onClick={toggleAudio}
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
            className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </button>
        </div>
        <audio ref={audioRef} src="/audio/navratri-dhun.mp3" loop />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Export modal                                                  */}
      {/* ------------------------------------------------------------ */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        format={exportFormat}
        onFormatChange={setExportFormat}
        current={current}
        imgError={imgError}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DayRail — horizontal night selector, scrollbar hidden on all       */
/*  browsers (Chrome/Safari/Edge via the ::-webkit-scrollbar variant,  */
/*  Firefox/legacy Edge via the inline style properties).               */
/* ------------------------------------------------------------------ */

function DayRail({ days, selectedDay, onSelect, onPrev, onNext }) {
  return (
    <nav className="relative z-10 mx-auto mb-8 flex max-w-3xl items-center gap-2 px-4">
      <button
        onClick={onPrev}
        aria-label="Previous night"
        className="hidden flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-[#c9b8e0] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60 sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        className="flex flex-1 gap-2 overflow-x-auto px-1 py-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {days.map((d) => {
          const active = d.day === selectedDay;
          return (
            <button
              key={d.day}
              onClick={() => onSelect(d.day)}
              aria-current={active ? "true" : undefined}
              aria-label={`Night ${d.day}: ${d.name}`}
              className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60 ${
                active
                  ? "border-white/30 bg-white/15 scale-105"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              style={
                active
                  ? { boxShadow: `0 0 18px ${hexToRgba(d.accent, 0.45)}` }
                  : undefined
              }
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${d.accent}, ${hexToRgba(
                        d.accent,
                        0.3
                      )})`
                    : "rgba(255,255,255,0.06)",
                  color: active ? "#fff" : "#c9b8e0",
                }}
              >
                {d.day}
              </span>
              <span className="hidden whitespace-nowrap text-[10px] text-[#c9b8e0]/60 sm:block">
                {d.name.replace("Maa ", "")}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        aria-label="Next night"
        className="hidden flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-[#c9b8e0] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60 sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  ExportModal — square/story export card, downloaded with            */
/*  html-to-image's toPng (html2canvas chokes on Tailwind's oklab()     */
/*  color functions and throws during capture; toPng doesn't).          */
/* ------------------------------------------------------------------ */

function ExportModal({ open, onClose, format, onFormatChange, current, imgError }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const cardRef = useRef(null);

  const accentSoft18 = hexToRgba(current.accent, 0.18);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError("");
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `navratri-day-${current.day}-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      setExportError(
        "Couldn't generate the image. Make sure html-to-image is installed — npm install html-to-image."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#140a24] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                <Camera className="h-5 w-5" style={{ color: GOLD }} />
                Export for socials
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-[#c9b8e0]/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => onFormatChange("square")}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60 ${
                  format === "square"
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 text-[#c9b8e0]/60 hover:bg-white/5"
                }`}
              >
                Square · 1:1
              </button>
              <button
                onClick={() => onFormatChange("story")}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b464]/60 ${
                  format === "story"
                    ? "border-white/40 bg-white/15 text-white"
                    : "border-white/10 text-[#c9b8e0]/60 hover:bg-white/5"
                }`}
              >
                Story · 9:16
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div
                ref={cardRef}
                className={`relative overflow-hidden rounded-2xl border-2 ${
                  format === "square"
                    ? "aspect-square w-full max-w-[280px]"
                    : "aspect-[9/16] w-full max-w-[200px]"
                }`}
                style={{
                  borderColor: current.accent,
                  background: `radial-gradient(circle at 50% 18%, ${accentSoft18}, #0b0617 72%)`,
                }}
              >
                {!imgError && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.image}
                    alt={current.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
                <div className="relative flex h-full flex-col items-center justify-end p-4 text-center">
                  <Crown className="mb-2 h-5 w-5" style={{ color: GOLD }} />
                  <p
                    className="text-[9px] tracking-[0.2em]"
                    style={{ color: hexToRgba(GOLD, 0.85) }}
                  >
                    NIGHT {current.day} OF 9
                  </p>
                  <h4 className="mt-1 font-serif text-lg font-semibold text-white">
                    {current.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] italic text-[#e4d9f5]/80">
                    {current.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-[10px] leading-snug text-[#e4d9f5]/70">
                    {current.lesson}
                  </p>
                  <p className="mt-3 text-[9px] tracking-widest text-[#c9b8e0]/50">
                    Nine Nights of the Devi
                  </p>
                </div>
              </div>
            </div>

            {exportError && (
              <p className="mb-3 text-center text-xs text-rose-300">
                {exportError}
              </p>
            )}

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                background: `linear-gradient(135deg, ${current.accent}, #4a2f72)`,
              }}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Generating…" : "Download image"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
