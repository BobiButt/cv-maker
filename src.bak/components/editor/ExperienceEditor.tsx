import { useCVStore } from '../../store/cvStore';
import {
  ItemCard,
  TextField,
  MonthField,
  TextArea,
  Checkbox,
  AddItemButton,
} from '../ui/Fields';
import type { ExperienceItem } from '../../types/cv';

export default function ExperienceEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const e = it as ExperienceItem;
        return (
          <ItemCard
            id={e.id}
            key={e.id}
            onRemove={() => removeItem(sectionId, e.id)}
            title={e.role || 'Experience'}
          >
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Role"
                value={e.role}
                onChange={(v) => updateItem(sectionId, e.id, { role: v })}
                placeholder="Frontend Engineer"
              />
              <TextField
                label="Company"
                value={e.company}
                onChange={(v) => updateItem(sectionId, e.id, { company: v })}
                placeholder="Acme Corp"
              />
            </div>
            <TextField
              label="Location"
              value={e.location ?? ''}
              onChange={(v) => updateItem(sectionId, e.id, { location: v })}
              placeholder="Berlin (optional)"
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
              label="Currently working here"
              checked={e.current}
              onChange={(v) => updateItem(sectionId, e.id, { current: v })}
            />
            <TextArea
              label="Description"
              value={e.description}
              onChange={(v) => updateItem(sectionId, e.id, { description: v })}
              placeholder={'• Led migration to React 18…\n• Built design system…'}
              rows={4}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add experience" />
    </div>
  );
}