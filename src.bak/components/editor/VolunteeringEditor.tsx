import { useCVStore } from '../../store/cvStore';
import {
  ItemCard,
  TextField,
  MonthField,
  TextArea,
  Checkbox,
  AddItemButton,
} from '../ui/Fields';
import type { VolunteeringItem } from '../../types/cv';

export default function VolunteeringEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const v = it as VolunteeringItem;
        return (
          <ItemCard
            id={v.id}
            key={v.id}
            onRemove={() => removeItem(sectionId, v.id)}
            title={v.role || 'Volunteering'}
          >
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Role"
                value={v.role}
                onChange={(x) => updateItem(sectionId, v.id, { role: x })}
              />
              <TextField
                label="Organization"
                value={v.org}
                onChange={(x) => updateItem(sectionId, v.id, { org: x })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MonthField
                label="Start"
                value={v.startDate}
                onChange={(x) => updateItem(sectionId, v.id, { startDate: x })}
              />
              <MonthField
                label="End"
                value={v.endDate}
                onChange={(x) => updateItem(sectionId, v.id, { endDate: x })}
              />
            </div>
            <Checkbox
              label="Currently volunteering"
              checked={v.current}
              onChange={(x) => updateItem(sectionId, v.id, { current: x })}
            />
            <TextArea
              label="Description"
              value={v.description ?? ''}
              onChange={(x) => updateItem(sectionId, v.id, { description: x })}
              rows={3}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add volunteering" />
    </div>
  );
}