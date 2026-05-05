import Link from "next/link";
import { getI18n, normalizeLocale } from "@/lib/i18n";
import type { StylePreset } from "@/lib/types";

const styleOptions: StylePreset[] = ["business", "luxury", "wellness", "dynamic", "playful"];

export default function HomePage({ searchParams }: { searchParams: { lang?: string | string[] } }) {
  const locale = normalizeLocale(searchParams.lang);
  const t = getI18n(locale);

  return (
    <main className="landing-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="landing-nav">
        <Link className="landing-brand" href="/">
          DeckPilot
        </Link>
        <div className="landing-links">
          <Link href={`/generate?lang=${locale}`}>{t.navGenerate}</Link>
          <span className="language-switch landing-language">
            <Link className={locale === "zh" ? "active" : ""} href="/?lang=zh">
              {t.languageZh}
            </Link>
            <Link className={locale === "en" ? "active" : ""} href="/?lang=en">
              {t.languageEn}
            </Link>
          </span>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-kicker">{t.landingKicker}</p>
          <h1>{t.landingHeadline}</h1>
          <p className="hero-subhead">{t.landingSubhead}</p>
          <div className="hero-proof">
            {t.landingProof.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="hero-product">
          <div className="input-card">
            <div className="card-topline">
              <span>{t.createDeck}</span>
              <span>{t.aiSaas}</span>
            </div>

            <div className="soft-field">
              <span>{t.courseIdea}</span>
              <strong>{t.courseIdeaValue}</strong>
            </div>

            <div className="soft-field two-line">
              <span>{t.audience}</span>
              <strong>{t.audienceValue}</strong>
            </div>

            <div className="style-pills" aria-label={t.stylePreset}>
              {styleOptions.map((item, index) => (
                <span className={index === 1 ? "active" : ""} key={item}>
                  {t.styleOptions[item]}
                </span>
              ))}
            </div>

            <Link className="landing-cta" href={`/generate?type=course&lang=${locale}`}>
              {t.generatePremiumDeck}
            </Link>
          </div>

          <div className="ppt-preview" aria-hidden="true">
            <div className="preview-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-slide">
              <div className="slide-copy">
                <span>{t.previewLabel}</span>
                <h2>{t.previewTitle}</h2>
                <p>{t.previewDesc}</p>
              </div>
              <div className="slide-visual">
                <div className="orb" />
                <div className="chart-card">
                  <span />
                  <strong>8.7</strong>
                  <small>{t.contentFit}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
