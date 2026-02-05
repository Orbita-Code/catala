"use client";

import { createContext, useContext, ReactNode } from "react";
import { addError } from "@/lib/errors";

interface ErrorTrackingContextType {
  trackError: (item: string) => void;
}

const ErrorTrackingContext = createContext<ErrorTrackingContextType | null>(null);

interface ErrorTrackingProviderProps {
  themeSlug: string;
  taskId: string;
  children: ReactNode;
}

export function ErrorTrackingProvider({ themeSlug, taskId, children }: ErrorTrackingProviderProps) {
  const trackError = (item: string) => {
    addError(themeSlug, taskId, item);
  };

  return (
    <ErrorTrackingContext.Provider value={{ trackError }}>
      {children}
    </ErrorTrackingContext.Provider>
  );
}

export function useErrorTracking() {
  const context = useContext(ErrorTrackingContext);
  // Return a no-op if not in a provider (for backwards compatibility)
  if (!context) {
    return { trackError: () => {} };
  }
  return context;
}
