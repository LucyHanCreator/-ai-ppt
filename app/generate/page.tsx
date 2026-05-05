import Link from "next/link";
import { GenerateForm } from "@/components/GenerateForm";
import { getI18n, normalizeLocale } from "@/lib/i18n";
import type { PptType } from "@/lib/types";

function normalizeType(type: string | string[] | undefined): PptType {
  const value = Array.isArray(type) ? type[0] : type;
  if (value === "investment" || value === "course" || value === "event") {
    return value;
  }
  return "investment";
}

export default function GeneratePage({ searchParams }: { searchParams: { type?: string | string[]; lang?: string | string[] } }) {
  const initialType = normalizeType(searchParams.type);
  const locale = normalizeLocale(searchParams.lang);
  const t = getI18n(locale);

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">
          {t.navBrand}
        </Link>
        <div className="language-switch">
          <Link className={locale === "zh" ? "active" : ""} href={`/generate?type=${initialType}&lang=zh`}>
            {t.languageZh}
          </Link>
          <Link className={locale === "en" ? "active" : ""} href={`/generate?type=${initialType}&lang=en`}>
            {t.languageEn}
          </Link>
        </div>
      </nav>

      <GenerateForm initialType={initialType} locale={locale} />
    </main>
  );
}
