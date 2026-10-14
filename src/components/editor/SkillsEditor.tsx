import { useState } from 'react';
import { X } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import type { SkillItem } from '../../types/cv';

export default function SkillsEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const removeItem = useCVStore((s) => s.removeItem);
  const [draft, setDraft] = useState('');

  if (!section) return null;

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    addItem(sectionId, { name: v });
    setDraft('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {section.items.map((it) => {
          const k = it as SkillItem;
          return (
            <span
              key={k.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 rounded"
            >
              {k.name}
              <button
                onClick={() => removeItem(sectionId, k.id)}
                className="hover:bg-slate-200 rounded p-0.5"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            </span>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          placeholder="Type a skill and press Enter"
          className="flex-1 px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={commit}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}