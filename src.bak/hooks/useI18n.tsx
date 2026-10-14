import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang, TranslationKey } from '../lib/i18n';
import { t as translate } from '../lib/i18n';

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = 'cv-maker:lang';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return saved === 'ar' ? 'ar' : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const value: I18nCtx = {
    lang,
    setLang,
    t: (key) => translate(lang, key),
    dir: lang === 'ar' ? 'rtl' : 'ltr',
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}