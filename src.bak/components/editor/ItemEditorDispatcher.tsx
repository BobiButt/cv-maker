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
} from '@dnd-kit/sortable';
import type { SectionType } from '../../types/cv';
import { useCVStore } from '../../store/cvStore';

import SummaryEditor from './SummaryEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';
import LanguagesEditor from './LanguagesEditor';
import CertificationsEditor from './CertificationsEditor';
import AwardsEditor from './AwardsEditor';
import VolunteeringEditor from './VolunteeringEditor';
import CustomItemsEditor from './CustomItemsEditor';

function EditorByType({ type, sectionId }: { type: SectionType; sectionId: string }) {
  switch (type) {
    case 'summary': return <SummaryEditor sectionId={sectionId} />;
    case 'experience': return <ExperienceEditor sectionId={sectionId} />;
    case 'education': return <EducationEditor sectionId={sectionId} />;
    case 'skills': return <SkillsEditor sectionId={sectionId} />;
    case 'projects': return <ProjectsEditor sectionId={sectionId} />;
    case 'languages': return <LanguagesEditor sectionId={sectionId} />;
    case 'certifications': return <CertificationsEditor sectionId={sectionId} />;
    case 'awards': return <AwardsEditor sectionId={sectionId} />;
    case 'volunteering': return <VolunteeringEditor sectionId={sectionId} />;
    case 'custom': return <CustomItemsEditor sectionId={sectionId} />;
    default: return null;
  }
}

export default function ItemEditorDispatcher({
  type,
  sectionId,
}: {
  type: SectionType;
  sectionId: string;
}) {
  const items = useCVStore(
    (s) => s.cv.sections.find((x) => x.id === sectionId)?.items ?? []
  );
  const reorderItems = useCVStore((s) => s.reorderItems);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from !== -1 && to !== -1) reorderItems(sectionId, from, to);
  };

  // Skills use a chip input — drag between chips makes no sense there
  if (type === 'skills') return <SkillsEditor sectionId={sectionId} />;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <EditorByType type={type} sectionId={sectionId} />
      </SortableContext>
    </DndContext>
  );
}