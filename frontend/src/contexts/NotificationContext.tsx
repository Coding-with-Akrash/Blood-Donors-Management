import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toaster, toast, ToastOptions } from 'sonner';

interface NotificationContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) => Promise<T>;
  dismiss: (toastId: string | number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const success = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, options);
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, options);
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    toast.warning(message, options);
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    toast.info(message, options);
  }, []);

  const promise = useCallback(<T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) => {
    return toast.promise(promise, messages);
  }, []);

  const dismiss = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info, promise, dismiss }}>
      {children}
      <Toaster
        position="top-right"
        theme="system"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}