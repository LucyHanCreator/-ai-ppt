"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PPT_TYPE_OPTIONS } from "@/lib/constants";
import { getI18n, type Locale } from "@/lib/i18n";
import { paletteOptions, palettes } from "@/lib/theme";
import type { ColorPalette, InputMode, OutputLanguage, PptType, StylePreset } from "@/lib/types";

type Props = {
  initialType: PptType;
  locale: Locale;
};

type PptTypeSelection = "auto" | PptType;

const STYLE_PRESET_OPTIONS: StylePreset[] = ["auto", "business", "luxury", "wellness", "dynamic", "playful"];

const OUTPUT_LANGUAGE_OPTIONS: OutputLanguage[] = ["zh", "en", "bilingual"];

export function GenerateForm({ initialType, locale }: Props) {
  const topicRef = useRef<HTMLTextAreaElement | null>(null);
  const [pptType, setPptType] = useState<PptType>(initialType);
  const [pptTypeSelection, setPptTypeSelection] = useState<PptTypeSelection>("auto");
  const [inputMode, setInputMode] = useState<InputMode>("auto");
  const [stylePreset, setStylePreset] = useState<StylePreset>("auto");
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>(locale === "zh" ? "zh" : "en");
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
  const [generationDone, setGenerationDone] = useState(false);
  const [error, setError] = useState("");
  const t = getI18n(locale);

  const currentType = useMemo(
    () => PPT_TYPE_OPTIONS.find((item) => item.value === pptType) || PPT_TYPE_OPTIONS[0],
    [pptType]
  );
  const topicCopy = t.topicByType[pptType];
  const dynamicCopy =
    inputMode === "auto"
      ? { title: t.autoModeTitle, subtitle: t.autoModeSubtitle }
      : t.formByType[pptType];
  const previewCopy =
    inputMode === "auto" && pptTypeSelection === "auto"
      ? { previewTitle: t.autoPreviewTitle, steps: t.autoPreviewSteps }
      : { previewTitle: t.previewByType[pptType].title, steps: t.previewByType[pptType].steps };
  const previewLabel = inputMode === "auto" && pptTypeSelection === "auto" ? t.autoDetect : t.pptTypes[currentType.value];
  const availablePalettes = stylePreset === "auto" ? [] : paletteOptions[stylePreset];
  const generationSteps = t.progress.steps;

  useEffect(() => {
    if (!isGenerating || generationDone) return undefined;

    const interval = window.setInterval(() => {
      setProgressPercent((percent) => {
        if (percent < 85) return Math.min(percent + 7, 85);
        return Math.min(percent + 1, 95);
      });
      setProgressStep((step) => Math.min(step + 1, generationSteps.length - 2));
    }, 2600);

    return () => window.clearInterval(interval);
  }, [generationDone, generationSteps.length, isGenerating]);

  function estimateRange(mode: InputMode) {
    if (mode === "standard") return t.progress.standardEstimate;
    return t.progress.autoEstimate;
  }

  function expectedMaxMs(mode: InputMode) {
    if (mode === "standard") return 30_000;
    return 20_000;
  }

  function progressMessage(mode: InputMode) {
    const elapsed = generationStartedAt ? Date.now() - generationStartedAt : 0;
    if (generationDone) return t.progress.complete;
    if (elapsed > expectedMaxMs(mode)) return t.progress.complex;
    if (progressPercent >= 85) return t.progress.generatingFile;
    return t.progress.generating;
  }

  function selectStylePreset(value: StylePreset) {
    setStylePreset(value);
    setColorPalette(value === "auto" ? null : paletteOptions[value][0]);
  }

  async function onBuildPrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPromptLoading(true);
    setPromptError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      pptType,
      targetAudience: String(formData.get("targetAudience") || ""),
      desiredAction: String(formData.get("desiredAction") || ""),
      keySellingPoints: String(formData.get("keySellingPoints") || ""),
      mustInclude: String(formData.get("mustInclude") || ""),
      outputLanguage
    };

    try {
      const response = await fetch("/api/build-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || t.errors.buildPrompt);
      }

      const data = (await response.json()) as { promptText?: string };
      if (topicRef.current && data.promptText) {
        topicRef.current.value = data.promptText;
        topicRef.current.focus();
      }
      setPromptOpen(false);
    } catch (err) {
      setPromptError(err instanceof Error ? err.message : t.errors.buildPrompt);
    } finally {
      setPromptLoading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setIsGenerating(true);
    setProgressStep(0);
    setProgressPercent(4);
    setGenerationStartedAt(Date.now());
    setGenerationDone(false);
    setError("");

    const formData = new FormData(event.currentTarget);
    const topic = String(formData.get("topic") || "");
    const requirements = String(formData.get("requirements") || "");
    const effectiveInputMode = inputMode;
    const payload = {
      pptType,
      inputMode: effectiveInputMode,
      stylePreset,
      colorPalette: stylePreset === "auto" ? undefined : colorPalette || availablePalettes[0],
      outputLanguage,
      topic,
      audience: String(formData.get("audience") || ""),
      goal: String(formData.get("goal") || ""),
      tone: String(formData.get("tone") || ""),
      slideCount: Number(formData.get("slideCount") || 8),
      requirements
    };
    const requestPayload = {
      ...payload,
      pptType: inputMode === "auto" && pptTypeSelection === "auto" ? "auto" : pptType
    };

    try {
      const outlineResponse = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      if (!outlineResponse.ok) {
        const data = await outlineResponse.json().catch(() => null);
        throw new Error(data?.error || t.errors.outline);
      }

      const outlineData = await outlineResponse.json();
      const pptResponse = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outlineData)
      });

      if (!pptResponse.ok) {
        const data = await pptResponse.json().catch(() => null);
        throw new Error(data?.error || t.errors.pptx);
      }

      const blob = await pptResponse.blob();
      setGenerationDone(true);
      setProgressStep(generationSteps.length - 1);
      setProgressPercent(100);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${outlineData?.outline?.title || payload.topic || "ai-ppt"}.pptx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.pptx);
      setIsGenerating(false);
      setProgressStep(0);
      setProgressPercent(0);
      setGenerationDone(false);
      setGenerationStartedAt(null);
    } finally {
      setLoading(false);
      window.setTimeout(() => {
        setIsGenerating(false);
        setProgressStep(0);
        setProgressPercent(0);
        setGenerationDone(false);
        setGenerationStartedAt(null);
      }, 900);
    }
  }

  return (
    <>
      <header className="studio-heading preview-fade" key={`heading-${locale}-${pptType}`}>
        <h1>{dynamicCopy.title}</h1>
        <p>{dynamicCopy.subtitle}</p>
      </header>

      <div className="studio-wrap">
      <form className="studio-panel" onSubmit={onSubmit}>
        <div className="input-mode-tabs" role="tablist" aria-label={t.inputModeLabel}>
          <button className={inputMode === "auto" ? "mode-tab active" : "mode-tab"} type="button" onClick={() => setInputMode("auto")}>
            {t.tabs.auto}
          </button>
          <button className={inputMode === "standard" ? "mode-tab active" : "mode-tab"} type="button" onClick={() => setInputMode("standard")}>
            {t.tabs.standard}
          </button>
        </div>

        <section className="topic-card preview-fade" key={`topic-${locale}-${pptType}-${inputMode}`}>
          <>
            <div className="topic-card-head">
              <div>
                <label htmlFor="topic">{inputMode === "auto" ? t.autoInputLabel : topicCopy.label}</label>
                <p>{inputMode === "auto" ? t.autoInputHelper : topicCopy.helperText}</p>
              </div>
              {inputMode === "standard" ? (
                <button className="ai-helper-button" type="button" onClick={() => setPromptOpen(true)}>
                  {t.aiHelperButton}
                </button>
              ) : null}
            </div>
            <textarea ref={topicRef} id="topic" name="topic" required placeholder={inputMode === "auto" ? t.autoInputPlaceholder : topicCopy.placeholder} />
          </>
        </section>

        <div className="choice-section">
          <div className="choice-head">
            <span>{t.pptType}</span>
          </div>
          <div className={inputMode === "auto" ? "choice-grid type-choice-grid auto-type-grid" : "choice-grid type-choice-grid"}>
            {inputMode === "auto" ? (
              <button className={pptTypeSelection === "auto" ? "choice-card active" : "choice-card"} type="button" onClick={() => setPptTypeSelection("auto")}>
                <strong>{t.autoDetect}</strong>
                <small>{t.autoDetectDescription}</small>
              </button>
            ) : null}
            {PPT_TYPE_OPTIONS.map((item) => (
              <button
                className={(inputMode === "auto" ? pptTypeSelection === item.value : pptType === item.value) ? "choice-card active" : "choice-card"}
                type="button"
                key={item.value}
                onClick={() => {
                  setPptType(item.value);
                  setPptTypeSelection(item.value);
                }}
              >
                <strong>{t.pptTypes[item.value]}</strong>
                <small>{t.pptTypeDescriptions[item.value]}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="choice-section compact">
          <div className="choice-head">
            <span>{t.stylePreset}</span>
          </div>
          <div className="pill-row">
            {STYLE_PRESET_OPTIONS.map((item) => (
              <button className={stylePreset === item ? "preset-pill active" : "preset-pill"} type="button" key={item} onClick={() => selectStylePreset(item)}>
                {t.styleOptions[item]}
              </button>
            ))}
          </div>
        </div>

        {stylePreset !== "auto" ? (
        <div className="choice-section compact preview-fade" key={`palette-${stylePreset}`}>
          <div className="choice-head">
            <span>{t.colorPalette}</span>
          </div>
          <div className="palette-row">
            {availablePalettes.map((key) => {
              const palette = palettes[stylePreset][key];
              const active = (colorPalette || availablePalettes[0]) === key;

              return (
                <button className={active ? "palette-card active" : "palette-card"} type="button" key={key} onClick={() => setColorPalette(key)}>
                  <span className="palette-dots" aria-hidden="true">
                    <i style={{ background: palette.primary }} />
                    <i style={{ background: palette.secondary }} />
                    <i style={{ background: palette.accent }} />
                  </span>
                  <strong>{t.paletteLabels[key]}</strong>
                </button>
              );
            })}
          </div>
        </div>
        ) : null}

        <div className="choice-section compact">
          <div className="choice-head">
            <span>{t.outputLanguage}</span>
          </div>
          <div className="pill-row">
            {OUTPUT_LANGUAGE_OPTIONS.map((item) => (
              <button className={outputLanguage === item ? "preset-pill active" : "preset-pill"} type="button" key={item} onClick={() => setOutputLanguage(item)}>
                {t.outputOptions[item]}
              </button>
            ))}
          </div>
        </div>

        {inputMode === "standard" ? (
        <section className="supporting-info">
          <div className="supporting-head">
            <h3>{t.additionalTitle}</h3>
            <p>{t.additionalDesc}</p>
          </div>
          <div className="advanced-grid">
            <div className="field">
              <label htmlFor="audience">{t.audience}</label>
              <input id="audience" name="audience" required placeholder={t.audienceValue} />
            </div>

            <div className="field">
              <label htmlFor="goal">{t.goal}</label>
              <input id="goal" name="goal" required placeholder={t.goalPlaceholder} />
            </div>

            <div className="field">
              <label htmlFor="tone">{t.tone}</label>
              <input id="tone" name="tone" required defaultValue={t.toneDefault} />
            </div>

            <div className="field">
              <label htmlFor="slideCount">{t.slideCount}</label>
              <select id="slideCount" name="slideCount" defaultValue="8">
                {Array.from({ length: 11 }, (_, index) => index + 5).map((count) => (
                  <option key={count} value={count}>
                    {count} {t.slideUnit}
                  </option>
                ))}
              </select>
            </div>

            <div className="field full">
              <label htmlFor="requirements">{t.requirements}</label>
              <textarea id="requirements" name="requirements" placeholder={t.requirementsPlaceholder} />
            </div>
          </div>
        </section>
        ) : null}

        <button className="studio-submit" type="submit" disabled={loading}>
          {generationDone ? t.submitDone : loading ? t.submitLoading : t.submitIdle}
        </button>

        {isGenerating ? (
          <section className="generation-progress" aria-live="polite">
            <div className="progress-head">
              <strong>{progressMessage(inputMode)}</strong>
              <span>{estimateRange(inputMode)}</span>
            </div>
            <div className="progress-track">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-steps">
              {generationSteps.map((step, index) => (
                <div className={index < progressStep || generationDone ? "progress-step active" : index === progressStep ? "progress-step active current" : "progress-step"} key={step}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
      </form>

      <aside className="studio-preview">
        <div className="preview-shell preview-fade" key={`${locale}-${inputMode}-${pptTypeSelection}-${pptType}`}>
          <div className="preview-slide-large">
            <span>{previewLabel}</span>
            <h2>{previewCopy.previewTitle}</h2>
            <div className="preview-blocks">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="preview-metrics">
            {previewCopy.steps.map((step, index) => (
              <div key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      </div>
      {promptOpen ? (
        <div className="prompt-modal-backdrop" role="dialog" aria-modal="true">
          <form className="prompt-modal" onSubmit={onBuildPrompt}>
            <div className="prompt-modal-head">
              <div>
                <strong>{t.promptAssistant.title}</strong>
                <p>{t.promptAssistant.desc}</p>
              </div>
              <button type="button" onClick={() => setPromptOpen(false)} aria-label={t.promptAssistant.close}>
                ×
              </button>
            </div>

            <div className="prompt-fields">
              <label>
                <span>{t.promptAssistant.q1}</span>
                <input value={t.pptTypes[pptType]} readOnly />
              </label>
              <label>
                <span>{t.promptAssistant.q2}</span>
                <input name="targetAudience" required placeholder={t.promptAssistant.q2Placeholder} />
              </label>
              <label>
                <span>{t.promptAssistant.q3}</span>
                <input name="desiredAction" required placeholder={t.promptAssistant.q3Placeholder} />
              </label>
              <label>
                <span>{t.promptAssistant.q4}</span>
                <textarea name="keySellingPoints" required placeholder={t.promptAssistant.q4Placeholder} />
              </label>
              <label>
                <span>{t.promptAssistant.q5}</span>
                <textarea name="mustInclude" placeholder={t.promptAssistant.q5Placeholder} />
              </label>
            </div>

            {promptError ? <p className="error">{promptError}</p> : null}
            <button className="studio-submit" type="submit" disabled={promptLoading}>
              {promptLoading ? t.promptAssistant.loading : t.promptAssistant.submit}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
