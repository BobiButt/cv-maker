import { useRef } from 'react';
import { User, X } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';

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
    </div>
  );
}