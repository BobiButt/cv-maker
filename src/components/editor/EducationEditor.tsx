import { useCVStore } from '../../store/cvStore';
import {
  ItemCard,
  TextField,
  MonthField,
  Checkbox,
  AddItemButton,
} from '../ui/Fields';
import type { EducationItem } from '../../types/cv';

export default function EducationEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const e = it as EducationItem;
        return (
          <ItemCard
            id={e.id}
            key={e.id}
            onRemove={() => removeItem(sectionId, e.id)}
            title={e.degree || 'Education'}
          >
            <TextField
              label="Degree"
              value={e.degree}
              onChange={(v) => updateItem(sectionId, e.id, { degree: v })}
              placeholder="BSc Computer Science"
            />
            <TextField
              label="School"
              value={e.school}
              onChange={(v) => updateItem(sectionId, e.id, { school: v })}
              placeholder="Technical University"
            />
            <TextField
              label="Location"
              value={e.location ?? ''}
              onChange={(v) => updateItem(sectionId, e.id, { location: v })}
              placeholder="Munich (optional)"
            />
            <div className="grid grid-cols-2 gap-2">
              <MonthField
                label="Start"
                value={e.startDate}
                onChange={(v) => updateItem(sectionId, e.id, { startDate: v })}
              />
              <MonthField
                label="End"
                value={e.endDate}
                onChange={(v) => updateItem(sectionId, e.id, { endDate: v })}
              />
            </div>
            <Checkbox
              label="Currently studying"
              checked={e.current}
              onChange={(v) => updateItem(sectionId, e.id, { current: v })}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add education" />
    </div>
  );
}