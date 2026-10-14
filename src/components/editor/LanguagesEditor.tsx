import { useCVStore } from '../../store/cvStore';
import { ItemCard, TextField, AddItemButton } from '../ui/Fields';
import type { LanguageItem } from '../../types/cv';

export default function LanguagesEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const l = it as LanguageItem;
        return (
          <ItemCard
            id={l.id}
            key={l.id}
            onRemove={() => removeItem(sectionId, l.id)}
            title={l.name || 'Language'}
          >
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Language"
                value={l.name}
                onChange={(v) => updateItem(sectionId, l.id, { name: v })}
                placeholder="English"
              />
              <TextField
                label="Proficiency"
                value={l.proficiency}
                onChange={(v) => updateItem(sectionId, l.id, { proficiency: v })}
                placeholder="Native / B2 / Fluent"
              />
            </div>
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add language" />
    </div>
  );
}