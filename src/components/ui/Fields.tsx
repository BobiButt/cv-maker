import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { SortableRow } from './Sortable';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="text-xs font-medium text-slate-600">{label}</span>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </label>
  );
}

export function MonthField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      {label && (
        <span className="text-xs font-medium text-slate-600">{label}</span>
      )}
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      {label && (
        <span className="text-xs font-medium text-slate-600">{label}</span>
      )}
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
      />
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-slate-300"
      />
      {label}
    </label>
  );
}

export function ItemCard({
  id,
  children,
  onRemove,
  title,
}: {
  id: string;
  children: ReactNode;
  onRemove: () => void;
  title?: string;
}) {
  return (
    <SortableRow id={id}>
      <div className="p-3 ps-8 bg-slate-50 rounded border border-slate-200 space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium text-slate-500">
            {title ?? 'Item'}
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-red-100 rounded"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
        {children}
      </div>
    </SortableRow>
  );
}

export function AddItemButton({
  onClick,
  label = 'Add item',
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded inline-flex items-center justify-center gap-1"
    >
      + {label}
    </button>
  );
}