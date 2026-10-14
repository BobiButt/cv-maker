import { useCVStore } from '../../store/cvStore';
import { ItemCard, TextField, TextArea, AddItemButton } from '../ui/Fields';
import type { ProjectItem } from '../../types/cv';

export default function ProjectsEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const p = it as ProjectItem;
        return (
          <ItemCard
            id={p.id}
            key={p.id}
            onRemove={() => removeItem(sectionId, p.id)}
            title={p.name || 'Project'}
          >
            <TextField
              label="Name"
              value={p.name}
              onChange={(v) => updateItem(sectionId, p.id, { name: v })}
              placeholder="Portfolio site"
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Role"
                value={p.role ?? ''}
                onChange={(v) => updateItem(sectionId, p.id, { role: v })}
                placeholder="Lead developer"
              />
              <TextField
                label="Link"
                value={p.link ?? ''}
                onChange={(v) => updateItem(sectionId, p.id, { link: v })}
                placeholder="https://…"
              />
            </div>
            <TextArea
              label="Description"
              value={p.description}
              onChange={(v) => updateItem(sectionId, p.id, { description: v })}
              rows={3}
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add project" />
    </div>
  );
}