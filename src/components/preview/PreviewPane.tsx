import { useEffect } from 'react';
import { useCVStore } from '../../store/cvStore';
import { getTemplate } from '../../templates';

export default function PreviewPane() {
  const cv = useCVStore((s) => s.cv);
  const { theme, settings } = cv;

  useEffect(() => {
    const id = 'cv-print-style';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `@page { size: ${settings.pageSize}; margin: ${settings.printMargin}mm; }`;
  }, [settings.pageSize, settings.printMargin]);

  useEffect(() => {
    const id = 'cv-google-font';
    let el = document.getElementById(id) as HTMLLinkElement | null;
    const family = theme.fontFamily.replace(/ /g, '+');
    if (!el) {
      el = document.createElement('link');
      el.id = id;
      el.rel = 'stylesheet';
      document.head.appendChild(el);
    }
    el.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
  }, [theme.fontFamily]);

  const Template = getTemplate(theme.template).component;

  return (
    <main className="cv-print-main flex-1 overflow-auto bg-slate-200 py-6 sm:py-10 flex justify-center">
      <div className="cv-preview-scale">
        <div
          id="cv-preview"
          dir={settings.rtl ? 'rtl' : 'ltr'}
          className="bg-white shadow-xl"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '16mm 18mm',
            fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
            fontSize: `${theme.fontSize}px`,
            lineHeight: theme.lineHeight,
            color: theme.textColor,
          }}
        >
          <Template cv={cv} />
        </div>
      </div>
    </main>
  );
}