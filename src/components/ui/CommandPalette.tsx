import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Palette, User, FileText, Plus, Download, Share2,
} from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES } from '../../templates';
import { exportJSON, exportHTML } from '../../lib/io';
import { encodeCVToURL } from '../../lib/share';

interface Command {
  id: string;
  label: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  run: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const navigate = useNavigate();
  const cv = useCVStore((s) => s.cv);
  const updateTheme = useCVStore((s) => s.updateTheme);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setQ('');
    setActive(0);
  };

  const commands: Command[] = [
    {
      id: 'nav.dashboard', label: 'Open My CVs', group: 'Navigate', icon: FileText,
      run: () => navigate('/dashboard'),
    },
    {
      id: 'nav.new', label: 'Create new CV', group: 'Navigate', icon: Plus,
      run: () => navigate('/dashboard'),
    },
    { id: 'personal', label: 'Go to Personal', group: 'Jump', icon: User, run: () => {} },
    {
      id: 'export.pdf', label: 'Export PDF', group: 'Export', icon: Download,
      run: () => window.print(),
    },
    {
      id: 'export.json', label: 'Save .cv.json', group: 'Export', icon: Download,
      run: () => exportJSON(cv),
    },
    {
      id: 'export.html', label: 'Download HTML', group: 'Export', icon: Download,
      run: () => exportHTML(cv),
    },
    {
      id: 'share', label: 'Copy share link', group: 'Share', icon: Share2,
      run: async () => {
        const url = encodeCVToURL(cv);
        try { await navigator.clipboard.writeText(url); } catch {}
      },
    },
    ...TEMPLATES.map<Command>((t) => ({
      id: `tpl.${t.id}`,
      label: `Use template: ${t.name}`,
      group: 'Templates',
      icon: Palette,
      run: () => updateTheme({ template: t.id }),
    })),
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(q.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-32"
      onClick={close}
    >
      <div
        className="w-[560px] bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 border-b border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                filtered[active]?.run();
                close();
              }
            }}
            placeholder="Type a command…"
            className="flex-1 py-3 outline-none text-sm"
          />
          <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1">
            ESC          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-400 text-center">
              No matching commands
            </div>
          )}
          {filtered.map((c, i) => {
            const Icon = c.icon;
            const isActive = i === active;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => { c.run(); close(); }}
                className={`w-full text-start px-4 py-2 flex items-center gap-2 text-sm ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-slate-500" />}
                <span className="flex-1">{c.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                  {c.group}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}