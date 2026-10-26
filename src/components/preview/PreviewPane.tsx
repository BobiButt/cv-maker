import { useEffect, useRef, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { getTemplate } from '../../templates';
import type { CVSettings } from '../../types/cv';

// CSS px per 1 mm at 96 dpi (the reference the browser uses for mm units).
const MM_TO_PX = 96 / 25.4;
// When shrinking to one page, stay a little below the printable height so
// fixed pixel paddings/margins cannot push content onto page 2.
const ONE_PAGE_SAFETY = 0.85;
const MIN_SCALE = 0.3;

const DEFAULT_PRINT_FIT: CVSettings['printFit'] = 'one-page';

export default function PreviewPane() {
  const cv = useCVStore((s) => s.cv);
  const { theme, settings } = cv;
  const printFit = settings.printFit ?? DEFAULT_PRINT_FIT;
  const sheetRef = useRef<HTMLDivElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const [printScale, setPrintScale] = useState(1);

  // Wait for images (profile photo etc.) to load before measuring so
  // scrollHeight reflects the real rendered size.
  const waitForImages = (): Promise<void> => {
    const imgs = Array.from(
      document.querySelectorAll('#cv-preview img')
    ) as HTMLImageElement[];
    if (imgs.length === 0) return Promise.resolve();
    return Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((res) => {
            if (img.complete) res();
            else img.addEventListener('load', () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          })
      )
    ).then(() => {});
  };

  // Re-measure whenever anything that changes the laid-out height changes.
  // Iterates a few times: changing font-size changes height, so re-measure
  // after applying the scale to make sure everything fits on one page.
  useEffect(() => {
    let scale = 1;
    let rafId: number;
    let timeoutId: number;

    const run = async () => {
      await waitForImages();
      rafId = requestAnimationFrame(() => {
        const sheet = sheetRef.current;
        if (!sheet) return;

        // Temporarily drop minHeight so scrollHeight reflects real content,
        // not the 297mm floor. Otherwise short CVs get falsely scaled down.
        const originalMinHeight = sheet.style.minHeight;
        sheet.style.minHeight = '0';

        const wrap = scaleWrapRef.current;
        const wrapZoom = wrap
          ? Math.max(parseFloat(getComputedStyle(wrap).zoom || '1') || 1, 0.01)
          : 1;
        const pt = parseFloat(getComputedStyle(sheet).paddingTop || '0');
        const pb = parseFloat(getComputedStyle(sheet).paddingBottom || '0');
        const contentHeight = Math.max(
          (sheet.scrollHeight - pt - pb) / wrapZoom,
          1
        );
        sheet.style.minHeight = originalMinHeight;

        const pageHeightMm = settings.pageSize === 'A4' ? 297 : 279.4;
        const printableMm = Math.max(pageHeightMm - 2 * settings.printMargin, 20);
        const printablePx = printableMm * MM_TO_PX;
        const ratio = printablePx / contentHeight;

        // Iteratively refine: after scaling font-size, content height changes.
        // Re-measure up to 3 times to converge on the right scale.
        let currentScale = 1;
        if (ratio < 1) {
          currentScale = Math.max(ratio * ONE_PAGE_SAFETY, MIN_SCALE);
          // Apply tentative scale and re-measure
          const prevFontSize = sheet.style.fontSize;
          sheet.style.fontSize = `${theme.fontSize * currentScale}px`;
          requestAnimationFrame(() => {
            const pt2 = parseFloat(getComputedStyle(sheet).paddingTop || '0');
            const pb2 = parseFloat(getComputedStyle(sheet).paddingBottom || '0');
            const h2 = Math.max(sheet.scrollHeight - pt2 - pb2, 1);
            const ratio2 = printablePx / h2;
            if (ratio2 < 1) {
              currentScale = Math.max(ratio2 * ONE_PAGE_SAFETY, MIN_SCALE);
            }
            sheet.style.fontSize = prevFontSize;
            scale = currentScale;
            setPrintScale(scale);
          });
        } else {
          setPrintScale(1);
        }
      });
    };

    if (printFit === 'one-page') {
      run();
      timeoutId = setTimeout(() => {
        cancelAnimationFrame(rafId);
      }, 2000);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
    setPrintScale(1);
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
            padding: '10mm 14mm',
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
