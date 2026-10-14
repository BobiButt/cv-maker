import { useI18n } from '../../hooks/useI18n';
import { Languages } from 'lucide-react';

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      title="Language"
      className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded inline-flex items-center gap-1"
    >
      <Languages className="w-3.5 h-3.5" />
      {lang === 'en' ? 'EN' : 'ع'}
    </button>
  );
}