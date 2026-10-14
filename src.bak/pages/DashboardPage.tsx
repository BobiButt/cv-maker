// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Copy, Trash2, FileText, Search, Home } from 'lucide-react';
import { db, duplicateCV, deleteCV } from '../lib/db';
import { createEmptyCV } from '../lib/cvFactory';
import { useCVStore } from '../store/cvStore';
import { useI18n } from '../hooks/useI18n';
import LangSwitcher from '../components/ui/LangSwitcher';

export default function DashboardPage() {
  const navigate = useNavigate();
  const loadCV = useCVStore((s) => s.loadCV);
  const { t } = useI18n();
  const [q, setQ] = useState('');

  const cvs = useLiveQuery(
    async () => db.cvs.orderBy('updatedAt').reverse().toArray(),
    []
  );

  const filtered = (cvs ?? []).filter((c) =>
    c.title.toLowerCase().includes(q.toLowerCase())
  );

  const createNew = async () => {
    const cv = createEmptyCV('Untitled CV');
    loadCV(cv);
    navigate('/editor');
  };

  const openCV = async (id: string) => {
    const rec = await db.cvs.get(id);
    if (rec) {
      loadCV(rec.data);
      navigate('/editor');
    }
  };

  const duplicate = async (id: string) => {
    await duplicateCV(id);
  };

  const remove = async (id: string) => {
    if (!confirm(t('dashboard.confirmDelete'))) return;
    await deleteCV(id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 h-14 flex items-center px-6 gap-3">
        <Link to="/" className="text-slate-500 hover:text-slate-800">
          <Home className="w-4 h-4" />
        </Link>
        <h1 className="font-semibold text-slate-800">{t('dashboard.title')}</h1>
        <div className="flex-1" />
        <LangSwitcher />
        <button
          onClick={createNew}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {t('btn.newCv')}
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('dashboard.search')}
            className="w-full ps-9 pe-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none focus:border-blue-500"
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>{t('dashboard.empty')}</p>
            <button
              onClick={createNew}
              className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('dashboard.createFirst')}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-slate-200 rounded p-4 hover:shadow-md transition group"
            >
              <button
                onClick={() => openCV(rec.id)}
                className="text-start w-full"
              >
                <div className="font-medium text-slate-800 truncate">
                  {rec.title}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {t('dashboard.updated')}{' '}
                  {new Date(rec.updatedAt).toLocaleString()}
                </div>
              </button>
              <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => duplicate(rec.id)}
                  className="p-1.5 hover:bg-slate-100 rounded"
                  title={t('dashboard.duplicate')}
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                </button>
                <button
                  onClick={() => remove(rec.id)}
                  className="p-1.5 hover:bg-red-100 rounded"
                  title={t('dashboard.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}