import { createContext, useContext } from 'react';

export const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => {
  return useContext(ToastContext);
};

export const comingSoon = (notify: (message: string) => void, label: string) => {
  notify(`${label} is outside this assignment’s scope`);
};
