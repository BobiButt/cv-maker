import { useEffect, useRef, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { getTemplate } from '../../templates';
import type { CVSettings } from '../../types/cv';

// CSS px per 1 mm at 96 dpi (the reference the browser uses for mm units).
const MM_TO_PX = 96 / 25.4;
// When shrinking to one page, aim a little below the printable height so fixed
// pixel paddings/margins in the templates cannot push content onto page 2.
const ONE_PAGE_SAFETY = 0.9;

const DEFAULT_PRINT_FIT: CVSettings['printFit'] = 'one-page';

export default function PreviewPane() {
  const cv = useCVStore((s) => s.cv);
  const { theme, settings } = cv;
  const printFit = settings.printFit ?? DEFAULT_PRINT_FIT;
  const sheetRef = useRef<HTMLDivElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const [printScale, setPrintScale] = useState(1);

  // Re-measure whenever anything that changes the laid-out height changes.
  // requestAnimationFrame guarantees the DOM has finished layout so
  // scrollHeight reflects the real rendered size.
  useEffect(() => {
    let scale = 1;
    if (printFit === 'one-page') {
      const raf = requestAnimationFrame(() => {
        const sheet = sheetRef.current;
        if (sheet) {
          // The preview wrapper may apply a visual `zoom` (Chrome) which also
          // scales layout measurements. Undo it so we measure the real size.
          const wrap = scaleWrapRef.current;
          const wrapZoom = wrap
            ? Math.max(parseFloat(getComputedStyle(wrap).zoom || '1') || 1, 0.01)
            : 1;
          const pt = parseFloat(getComputedStyle(sheet).paddingTop || '0');
          const pb = parseFloat(getComputedStyle(sheet).paddingBottom || '0');
          // Height of the actual content (padding excluded) at real size.
          const contentHeight = Math.max((sheet.scrollHeight - pt - pb) / wrapZoom, 1);
          const pageHeightMm = settings.pageSize === 'A4' ? 297 : 279.4;
          const printableMm = Math.max(pageHeightMm - 2 * settings.printMargin, 20);
          const printablePx = printableMm * MM_TO_PX;
          const ratio = printablePx / contentHeight;
          // Only shrink when the content really overflows one sheet.
          if (ratio < 1) {
            scale = Math.max(ratio * ONE_PAGE_SAFETY, 0.45);
          }
        }
        setPrintScale(scale);
      });
      return () => cancelAnimationFrame(raf);
    }
    setPrintScale(scale);
  }, [
    printFit,
    settings.pageSize,
    settings.printMargin,
    theme.fontSize,
    theme.lineHeight,
    theme.spacing,
    cv,
  ]);

  useEffect(() => {
    const id = 'cv-print-style';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    const pageRule = `@page { size: ${settings.pageSize}; margin: ${settings.printMargin}mm; }`;
    // When forcing one page, reduce the print font-size so the laid-out content
    // fits a single sheet. `!important` wins over the inline screen font-size.
    const fitRule =
      printFit === 'one-page' && printScale < 1
        ? `#cv-preview { font-size: ${theme.fontSize * printScale}px !important; }`
        : '';
    el.textContent = `${pageRule}\n${fitRule}`;
  }, [settings.pageSize, settings.printMargin, printFit, printScale, theme.fontSize]);

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
      <div className="cv-preview-scale" ref={scaleWrapRef}>
        <div
          ref={sheetRef}
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
