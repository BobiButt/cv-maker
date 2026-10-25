import { useRef, useState } from 'react';
import { User, X } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import type { CVLink } from '../../types/cv';

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </label>
  );
}

function LinkRow({
  link,
  index,
  onChangeLabel,
  onChangeUrl,
  onRemove,
}: {
  link: CVLink;
  index: number;
  onChangeLabel: (index: number, value: string) => void;
  onChangeUrl: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 items-end">
      <input
        value={link.label}
        placeholder="LinkedIn"
        onChange={(e) => onChangeLabel(index, e.target.value)}
        className="px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-24"
      />
      <input
        value={link.url}
        placeholder="https://…"
        onChange={(e) => onChangeUrl(index, e.target.value)}
        className="px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none flex-1"
      />
      <button
        onClick={() => onRemove(index)}
        className="p-1.5 hover:bg-red-100 rounded text-red-600"
        title="Remove link"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function PersonalForm() {
  const personal = useCVStore((s) => s.cv.personal);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickPhoto = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('Please pick an image under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updatePersonal({ photo: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const [links, setLinks] = useState<CVLink[]>(personal.links);

  const updateLinkLabel = (index: number, value: string) => {
    const next = [...links];
    next[index] = { ...next[index], label: value };
    setLinks(next);
    updatePersonal({ links: next });
  };

  const updateLinkUrl = (index: number, value: string) => {
    const next = [...links];
    next[index] = { ...next[index], url: value };
    setLinks(next);
    updatePersonal({ links: next });
  };

  const removeLink = (index: number) => {
    const next = links.filter((_, i) => i !== index);
    setLinks(next);
    updatePersonal({ links: next });
  };

  const addLink = () => {
    const next = [...links, { id: crypto.randomUUID?.() ?? String(Date.now()), label: '', url: '' }];
    setLinks(next);
    updatePersonal({ links: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {personal.photo ? (
            <img
              src={personal.photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickPhoto(f);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50"
          >
            Upload photo
          </button>
          {personal.photo && (
            <button
              onClick={() => updatePersonal({ photo: undefined })}
              className="text-xs inline-flex items-center gap-1 text-red-600 hover:underline"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
      </div>

      <Field
        label="Full name"
        value={personal.fullName}
        onChange={(v) => updatePersonal({ fullName: v })}
        placeholder="Alex Morgan"
      />
      <Field
        label="Job title"
        value={personal.jobTitle}
        onChange={(v) => updatePersonal({ jobTitle: v })}
        placeholder="Frontend Engineer"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" value={personal.email} onChange={(v) => updatePersonal({ email: v })} />
        <Field label="Phone" value={personal.phone} onChange={(v) => updatePersonal({ phone: v })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location" value={personal.location} onChange={(v) => updatePersonal({ location: v })} />
        <Field label="Website" value={personal.website} onChange={(v) => updatePersonal({ website: v })} />
      </div>

      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-600">Social links</span>
          <button
            onClick={addLink}
            className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
          >
            + Add link
          </button>
        </div>
        <div className="space-y-1.5">
          {links.map((link, i) => (
            <LinkRow
              key={link.id}
              link={link}
              index={i}
              onChangeLabel={updateLinkLabel}
              onChangeUrl={updateLinkUrl}
              onRemove={removeLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}