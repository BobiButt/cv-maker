import {
  Undo2, Redo2, Download, Upload, FileJson, FileCode, Share2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { createSampleCV } from '../../lib/cvFactory';
import { exportJSON, exportHTML, importJSON } from '../../lib/io';
import { encodeCVToURL } from '../../lib/share';
import { useI18n } from '../../hooks/useI18n';
import LangSwitcher from '../ui/LangSwitcher';

export default function Topbar() {
  const title = useCVStore((s) => s.cv.meta.title);
  const cv = useCVStore((s) => s.cv);
  const setTitle = useCVStore((s) => s.setTitle);
  const undo = useCVStore((s) => s.undo);
  const redo = useCVStore((s) => s.redo);
  const loadCV = useCVStore((s) => s.loadCV);

  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImportFile = async (file: File) => {
    try {
      const parsed = await importJSON(file);
      loadCV(parsed);
    } catch {
      alert('Could not load this file. Make sure it is a .cv.json export.');
    }
  };

  const onShare = async () => {
    const url = encodeCVToURL(cv);
    try {
      await navigator.clipboard.writeText(url);
      setToast(t('toast.linkCopied'));
    } catch {
      window.prompt('Copy this link:', url);
    }
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-medium text-slate-800 bg-transparent outline-none focus:bg-slate-100 px-2 py-1 rounded w-64"
      />
      <div className="flex-1" />

      <LangSwitcher />

      <button
        onClick={() => loadCV(createSampleCV())}
        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
      >
        {t('btn.sample')}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImportFile(f);
          e.target.value = '';
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded inline-flex items-center gap-1.5"
      >
        <Upload className="w-4 h-4" /> {t('btn.import')}
      </button>

      <button onClick={undo} title={t('btn.undo')} className="p-2 hover:bg-slate-100 rounded">
        <Undo2 className="w-4 h-4" />
      </button>
      <button onClick={redo} title={t('btn.redo')} className="p-2 hover:bg-slate-100 rounded">
        <Redo2 className="w-4 h-4" />
      </button>

      <button
        onClick={onShare}
        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded inline-flex items-center gap-1.5"
      >
        <Share2 className="w-4 h-4" /> {t('btn.share')}
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> {t('btn.export')}
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => window.print(), 100);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> PDF (print)
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  exportJSON(cv);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" /> Save .cv.json
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  exportHTML(cv);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" /> Download HTML
              </button>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className="fixed top-16 right-4 bg-slate-900 text-white text-sm px-3 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </header>
  );
}