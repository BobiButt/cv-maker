// src/components/ui/Sortable.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

export function SortableRow({
  id,
  children,
  handleClassName,
}: {
  id: string;
  children: ReactNode;
  handleClassName?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        {...attributes}
        {...listeners}
        className={
          handleClassName ??
          'absolute start-1 top-2 p-1 cursor-grab active:cursor-grabbing hover:bg-slate-200 rounded z-10'
        }
        title="Drag to reorder"
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
      </button>
      {children}
    </div>
  );
}