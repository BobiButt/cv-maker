import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVStore } from '../store/cvStore';
import { exportJSON } from '../lib/io';

export function useKeyboardShortcuts() {
  const undo = useCVStore((s) => s.undo);
  const redo = useCVStore((s) => s.redo);
  const cv = useCVStore((s) => s.cv);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Ctrl+S — save JSON
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        exportJSON(cv);
        return;
      }

      // Ctrl+P — print
      if (mod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
        return;
      }

      // Ctrl+Z — undo (skip if Ctrl+Shift+Z = redo)
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') {
        const target = e.target as HTMLElement;
        // don't hijack native undo inside text fields
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Shift+Z or Ctrl+Y — redo
      if (
        (mod && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (mod && e.key.toLowerCase() === 'y')
      ) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+E — go to dashboard
      if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cv, undo, redo, navigate]);
}