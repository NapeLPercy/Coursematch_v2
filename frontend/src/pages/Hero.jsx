import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import "../styles/Hero.css";

const FEATURES = {images:[
  {
    label: "AI Course Recommendations",
    img: "/ai_course_recommendation_hero.png",
  },
  {
    label: "Career Deep Dive",
    img: "/course_deep_dive_hero.png",
  },
  {
    label: "Course Comparison",
    img: "/course_comparison_hero.png",
  },
],
pills: ["Requirements clarity", "Instant ranking", "Student-first"]
};


export default function Hero() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("hero--mounted"));
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-label="CourseMatch hero">
      {/* ── ambient blobs ── */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />
      <div className="hero__mesh" aria-hidden="true" />

      <div className="hero__deco hero__deco--tl" aria-hidden="true">
        <GraduationCap size={180} strokeWidth={0.6} />
      </div>
      <div className="hero__deco hero__deco--br" aria-hidden="true">
        <BookOpen size={160} strokeWidth={0.6} />
      </div>

      <div className="hero__inner">
        {/* ══════════════════════
            TOP — text block
        ══════════════════════ */}
        <div className="hero__copy">
          {/* Badge */}
          <div className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            AI-Powered Course Matching
          </div>

          {/* Title */}
          <h1 className="hero__title">
            Find your perfect
            <span className="hero__title-highlight"> course.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle">
            CourseMatch ranks every course you qualify for — instantly. See
            exactly where you stand, what you need to improve, and which doors
            are already open.
          </p>

          {/* Tick pills */}
          <ul className="hero__pills" aria-label="Key features">
            {FEATURES.pills.map((p) => (
              <li key={p} className="hero__pill">
                <CheckCircle2
                  size={15}
                  strokeWidth={2.5}
                  className="hero__pill-icon"
                />
                {p}
              </li>
            ))}
          </ul>

          {/* CTAs — always side by side */}
          <div className="hero__actions">
            <button
              className="hero__btn hero__btn--primary"
              type="button"
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
            <button
              className="hero__btn hero__btn--ghost"
              type="button"
              onClick={() =>
                document.getElementById("hiw-section")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              How it works
            </button>
          </div>
        </div>

        {/* ══════════════════════
            BOTTOM — 3 image cards
            connected by a line
        ══════════════════════ */}
        <div className="hero__cards-wrap" aria-label="Platform features">
          {/* connector line — hidden on mobile, replaced by vertical */}
          <div className="hero__line" aria-hidden="true">
            <div className="hero__line-track">
              <div className="hero__line-fill" />
            </div>
            {/* dots at each card junction */}
            {FEATURES.images.map((_, i) => (
              <div
                key={i}
                className="hero__line-dot"
                style={{
                  left: `calc(${i * 50}% + ${i === 0 ? "16%" : i === 1 ? "0%" : "-16%"})`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="hero__cards">
            {FEATURES.images.map((f, i) => (
              <div key={f.label} className="hero__card" style={{ "--ci": i }}>
                {/* vertical connector dot on mobile */}
                {i > 0 && (
                  <div className="hero__card-connector" aria-hidden="true">
                    <div className="hero__card-connector-line" />
                    <div className="hero__card-connector-dot" />
                  </div>
                )}

                <div className="hero__card-img-wrap">
                  <img
                    src={f.img}
                    alt={f.label}
                    className="hero__card-img"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>

                <p className="hero__card-label">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
