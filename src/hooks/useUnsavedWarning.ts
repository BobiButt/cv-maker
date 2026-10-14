import { useEffect, useRef } from 'react';
import { useCVStore } from '../store/cvStore';

export function useUnsavedWarning() {
  const updatedAt = useCVStore((s) => s.cv.meta.updatedAt);
  const lastChange = useRef<number>(Date.now());

  useEffect(() => {
    lastChange.current = Date.now();
  }, [updatedAt]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const age = Date.now() - lastChange.current;
      // if a change happened in the last 2 seconds, warn
      if (age < 2000) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
}