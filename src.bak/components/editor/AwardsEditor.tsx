import { useCVStore } from '../../store/cvStore';
import { ItemCard, TextField, TextArea, AddItemButton } from '../ui/Fields';
import type { AwardItem } from '../../types/cv';

export default function AwardsEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const a = it as AwardItem;
        return (
          <ItemCard
            id={a.id}
            key={a.id}
            onRemove={() => removeItem(sectionId, a.id)}
            title={a.title || 'Award'}
          >
            <TextField
              label="Title"
              value={a.title}
              onChange={(v) => updateItem(sectionId, a.id, { title: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Issuer"
                value={a.issuer ?? ''}
                onChange={(v) => updateItem(sectionId, a.id, { issuer: v })}
              />
              <TextField
                label="Date"
                value={a.date ?? ''}
                onChange={(v) => updateItem(sectionId, a.id, { date: v })}
              />
            </div>
            <TextArea
              label="Description"
              value={a.description ?? ''}
              onChange={(v) => updateItem(sectionId, a.id, { description: v })}
              rows={2}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add award" />
    </div>
  );
}