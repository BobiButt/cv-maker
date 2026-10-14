import { Eye, EyeOff, Trash2, Plus, ChevronDown, GripVertical } from 'lucide-react';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCVStore } from '../../store/cvStore';
import type { SectionType } from '../../types/cv';
import ItemEditorDispatcher from './ItemEditorDispatcher';
import { useI18n } from '../../hooks/useI18n';

const ADDABLE: { type: SectionType; labelKey: string }[] = [
  { type: 'summary', labelKey: 'section.summary' },
  { type: 'experience', labelKey: 'section.experience' },
  { type: 'education', labelKey: 'section.education' },
  { type: 'skills', labelKey: 'section.skills' },
  { type: 'projects', labelKey: 'section.projects' },
  { type: 'languages', labelKey: 'section.languages' },
  { type: 'certifications', labelKey: 'section.certifications' },
  { type: 'awards', labelKey: 'section.awards' },
  { type: 'volunteering', labelKey: 'section.volunteering' },
  { type: 'custom', labelKey: 'section.custom' },
];

function SortableSection({
  section,
  isOpen,
  onToggleOpen,
}: {
  section: any;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const toggleSection = useCVStore((s) => s.toggleSection);
  const removeSection = useCVStore((s) => s.removeSection);
  const renameSection = useCVStore((s) => s.renameSection);
  const { t } = useI18n();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-slate-200 rounded bg-white"
    >
      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 rounded-t">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-200 rounded"
          title={t('sections.drag')}
        >
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        </button>
        <button
          onClick={onToggleOpen}
          className="p-1 hover:bg-slate-200 rounded"
          title={isOpen ? t('sections.collapse') : t('sections.expand')}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <input
          value={section.title}
          onChange={(e) => renameSection(section.id, e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 px-1 py-0.5 rounded focus:bg-white border border-transparent focus:border-slate-300"
        />
        <span className="text-xs text-slate-400">({section.items.length})</span>
        <button
          onClick={() => toggleSection(section.id)}
          className="p-1 hover:bg-slate-200 rounded"
          title={section.visible ? t('sections.hide') : t('sections.show')}
        >
          {section.visible ? (
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        <button
          onClick={() => removeSection(section.id)}
          className="p-1 hover:bg-red-100 rounded"
          title={t('sections.delete')}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
      {isOpen && (
        <div className="p-3 border-t border-slate-200">
          <ItemEditorDispatcher type={section.type} sectionId={section.id} />
        </div>
      )}
    </div>
  );
}

export default function SectionsEditor() {
  const sections = useCVStore((s) => s.cv.sections);
  const addSection = useCVStore((s) => s.addSection);
  const reorderSections = useCVStore((s) => s.reorderSections);
  const { t } = useI18n();

  const [picking, setPicking] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((s) => s.id === active.id);
    const to = sections.findIndex((s) => s.id === over.id);
    if (from !== -1 && to !== -1) reorderSections(from, to);
  };

  const handleAdd = (type: SectionType) => {
    addSection(type);
    setPicking(false);
    const next = useCVStore.getState().cv.sections;
    const last = next[next.length - 1];
    if (last) setOpenId(last.id);
  };

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((s) => (
              <SortableSection
                key={s.id}
                section={s}
                isOpen={openId === s.id}
                onToggleOpen={() => setOpenId(openId === s.id ? null : s.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {picking ? (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded">
          {ADDABLE.map((a) => (
            <button
              key={a.type}
              onClick={() => handleAdd(a.type)}
              className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:border-blue-500"
            >
              {t(a.labelKey as any)}
            </button>
          ))}
          <button
            onClick={() => setPicking(false)}
            className="px-2 py-1 text-xs text-slate-500"
          >
            {t('sections.cancel')}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setPicking(true)}
          className="w-full py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded inline-flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> {t('sections.add')}
        </button>
      )}
    </div>
  );
}