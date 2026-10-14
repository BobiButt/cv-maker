import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Topbar from '../components/editor/Topbar';
import Sidebar from '../components/editor/Sidebar';
import PreviewPane from '../components/preview/PreviewPane';
import { useCVStore } from '../store/cvStore';
import { importJSON } from '../lib/io';
import { decodeCVFromURL, clearShareHash } from '../lib/share';
import CommandPalette from '../components/ui/CommandPalette';
import SaveToast from '../components/ui/SaveToast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function EditorPage() {
  const loadCV = useCVStore((s) => s.loadCV);
  const [dragging, setDragging] = useState(false);
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
      className="h-screen flex flex-col bg-slate-100 relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="h-9 bg-slate-900 text-white flex items-center px-4 text-xs gap-3 shrink-0">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-3 h-3" /> My CVs
        </Link>
      </div>
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <PreviewPane />
      </div>

      {dragging && (
        <div className="absolute inset-0 bg-blue-600/10 border-4 border-dashed border-blue-500 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-3 rounded shadow text-blue-700 font-medium">
            Drop .cv.json to load
          </div>
        </div>
      )}
<SaveToast />
      <CommandPalette />
    </div>
  );
}