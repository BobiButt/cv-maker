import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, PenLine } from 'lucide-react';
import Topbar from '../components/editor/Topbar';
import Sidebar from '../components/editor/Sidebar';
import PreviewPane from '../components/preview/PreviewPane';
import { useCVStore } from '../store/cvStore';
import { importJSON } from '../lib/io';
import { decodeCVFromURL, clearShareHash } from '../lib/share';
import CommandPalette from '../components/ui/CommandPalette';
import SaveToast from '../components/ui/SaveToast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useI18n } from '../hooks/useI18n';

type MobileView = 'edit' | 'preview';

export default function EditorPage() {
  const loadCV = useCVStore((s) => s.loadCV);
  const { t } = useI18n();
  const [dragging, setDragging] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  useKeyboardShortcuts();

  // Hydrate from share hash if present
  useEffect(() => {
    const shared = decodeCVFromURL();
    if (shared) {
      loadCV(shared);
      clearShareHash();
    }
  }, [loadCV]);

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const cv = await importJSON(file);
      loadCV(cv);
    } catch {
      alert('Could not read that file.');
    }
  };

  return (
    <div
      className="cv-app h-screen flex flex-col bg-slate-100 relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="cv-chrome h-9 bg-slate-900 text-white flex items-center px-4 text-xs gap-3 shrink-0">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-3 h-3" /> {t('common.back')}
        </Link>
      </div>

      <Topbar />

      {/* Mobile view switcher */}
      <div className="cv-chrome lg:hidden flex bg-white border-b border-slate-200 shrink-0">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-2 text-sm font-medium inline-flex items-center justify-center gap-1.5 ${
            mobileView === 'edit'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500'
          }`}
        >
          <PenLine className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-sm font-medium inline-flex items-center justify-center gap-1.5 ${
            mobileView === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500'
          }`}
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>

      <div className="cv-print-row flex-1 flex overflow-hidden">
        <div
          className={`cv-chrome ${
            mobileView === 'edit' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-auto shrink-0`}
        >
          <Sidebar />
        </div>

        <div
          className={`cv-print-column ${
            mobileView === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-1 overflow-hidden`}
        >
          <PreviewPane />
        </div>
      </div>

      {dragging && (
        <div className="absolute inset-0 bg-blue-600/10 border-4 border-dashed border-blue-500 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-3 rounded shadow text-blue-700 font-medium">
            {t('common.dropHint')}
          </div>
        </div>
      )}

      <SaveToast />
      <CommandPalette />
    </div>
  );
}