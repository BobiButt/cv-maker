import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';

export default function SaveToast() {
  const updatedAt = useCVStore((s) => s.cv.meta.updatedAt);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Whenever updatedAt changes, flash the pill
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [updatedAt]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
      <Check className="w-3 h-3 text-emerald-400" />
      Saved
    </div>
  );
}