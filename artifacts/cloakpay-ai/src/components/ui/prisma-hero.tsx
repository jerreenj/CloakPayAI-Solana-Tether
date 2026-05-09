import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useRef } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`words-pull-up ${className}`} style={style}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <motion.span
            key={`${word}-${index}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="words-pull-up-word"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && <span className="hero-asterisk">*</span>}
          </motion.span>
        );
      })}
    </div>
  );
};

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((segment) => {
    segment.text.split(" ").forEach((word) => {
      if (word) words.push({ word, className: segment.className });
    });
  });

  return (
    <div ref={ref} className={`words-pull-up words-pull-up-center ${className}`} style={style}>
      {words.map((item, index) => (
        <motion.span
          key={`${item.word}-${index}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`words-pull-up-word ${item.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  );
};

const navItems = [
  { label: "Desk", href: "#overview" },
  { label: "Legal", href: "#legal" },
  { label: "Merchant", href: "#merchant" },
  { label: "Lens", href: "#lens" },
  { label: "Payroll", href: "#payroll" }
];

const heroVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

const PrismaHero = () => {
  return (
    <section className="prisma-hero" aria-label="CloakPay AI product intro">
      <div className="prisma-hero-frame">
        <video autoPlay loop muted playsInline className="prisma-hero-video" src={heroVideo} />
        <div className="noise-overlay" />
        <div className="prisma-hero-gradient" />

        <nav className="prisma-hero-nav" aria-label="Page navigation">
          <div>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="prisma-hero-content">
          <div className="prisma-hero-title">
            <h1>
              <WordsPullUp text="CloakPay AI" showAsterisk />
            </h1>
          </div>

          <div className="prisma-hero-side">
            <p>
              Your private business operating system on Solana. Draft deals, inspect wallets, build payroll, and prepare
              payment proof locally with QVAC before anything reaches the chain.
            </p>

            <a href="#legal" className="prisma-hero-cta">
              Open desk
              <span>
                <ArrowRight aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
