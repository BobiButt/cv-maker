import { useState } from 'react';
import { ChevronDown, User, LayoutList, Palette } from 'lucide-react';
import PersonalForm from './PersonalForm';
import SectionsEditor from './SectionsEditor';
import ThemeEditor from './ThemeEditor';
import { useI18n } from '../../hooks/useI18n';

function Group({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-start"
      >
        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="font-medium text-slate-800 flex-1 truncate">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="px-3 sm:px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function Sidebar() {
  const { t } = useI18n();
  return (
    <aside className="w-full lg:w-[420px] bg-white border-e border-slate-200 overflow-y-auto shrink-0">
      <Group title={t('group.personal')} icon={User} defaultOpen>
        <PersonalForm />
      </Group>
      <Group title={t('group.sections')} icon={LayoutList} defaultOpen>
        <SectionsEditor />
      </Group>
      <Group title={t('group.theme')} icon={Palette}>
        <ThemeEditor />
      </Group>
    </aside>
  );
}