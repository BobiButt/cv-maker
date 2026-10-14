import { AddItemButton, ItemCard, TextArea, TextField } from '../ui/Fields';
import { useCVStore } from '../../store/cvStore';
import type { CustomItem } from '../../types/cv';

export default function CustomItemsEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const c = it as CustomItem;
        return (
          <ItemCard
            id={c.id}
            key={c.id}
            onRemove={() => removeItem(sectionId, c.id)}
            title={c.title || 'Item'}
          >
            <TextField
              label="Title"
              value={c.title}
              onChange={(v) => updateItem(sectionId, c.id, { title: v })}
            />
            <TextField
              label="Subtitle"
              value={c.subtitle ?? ''}
              onChange={(v) => updateItem(sectionId, c.id, { subtitle: v })}
            />
            <TextField
              label="Date"
              value={c.date ?? ''}
              onChange={(v) => updateItem(sectionId, c.id, { date: v })}
            />
            <TextArea
              label="Description"
              value={c.description ?? ''}
              onChange={(v) => updateItem(sectionId, c.id, { description: v })}
              rows={3}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add item" />
    </div>
  );
}