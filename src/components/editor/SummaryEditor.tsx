import { useCVStore } from '../../store/cvStore';
import { ItemCard, TextArea, AddItemButton } from '../ui/Fields';
import type { SummaryItem } from '../../types/cv';

export default function SummaryEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const s = it as SummaryItem;
        return (
          <ItemCard
            id={s.id}
            key={s.id}
            onRemove={() => removeItem(sectionId, s.id)}
            title="Summary"
          >
            <TextArea
              value={s.text}
              onChange={(v) => updateItem(sectionId, s.id, { text: v })}
              placeholder="Short professional summary…"
              rows={4}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add summary" />
    </div>
  );
}