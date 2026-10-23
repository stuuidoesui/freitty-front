import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from './useToast';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const notify = useCallback((text: string) => {
    if (timer.current != null) window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(null), 2500);
  }, []);

  useEffect(
    () => () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {message ? (
        <div
          aria-live="polite"
          className="fixed right-4 bottom-4 z-50 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
};
