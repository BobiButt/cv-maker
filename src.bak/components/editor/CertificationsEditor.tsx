import { useCVStore } from '../../store/cvStore';
import { ItemCard, TextField, AddItemButton } from '../ui/Fields';
import type { CertificationItem } from '../../types/cv';

export default function CertificationsEditor({ sectionId }: { sectionId: string }) {
  const section = useCVStore((s) => s.cv.sections.find((x) => x.id === sectionId));
  const addItem = useCVStore((s) => s.addItem);
  const updateItem = useCVStore((s) => s.updateItem);
  const removeItem = useCVStore((s) => s.removeItem);

  if (!section) return null;

  return (
    <div className="space-y-3">
      {section.items.map((it) => {
        const c = it as CertificationItem;
        return (
          <ItemCard
            id={c.id}
            key={c.id}
            onRemove={() => removeItem(sectionId, c.id)}
            title={c.name || 'Certification'}
          >
            <TextField
              label="Name"
              value={c.name}
              onChange={(v) => updateItem(sectionId, c.id, { name: v })}
              placeholder="AWS Certified Developer"
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Issuer"
                value={c.issuer}
                onChange={(v) => updateItem(sectionId, c.id, { issuer: v })}
                placeholder="Amazon"
              />
              <TextField
                label="Date"
                value={c.date}
                onChange={(v) => updateItem(sectionId, c.id, { date: v })}
                placeholder="2024-03"
              />
            </div>
            <TextField
              label="Link"
              value={c.link ?? ''}
              onChange={(v) => updateItem(sectionId, c.id, { link: v })}
              placeholder="https://…"
            />
          </ItemCard>
        );
      })}
      <AddItemButton onClick={() => addItem(sectionId)} label="Add certification" />
    </div>
  );
}