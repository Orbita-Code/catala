"use client";

import { useState, useCallback } from "react";

const HINT_THRESHOLD = 2; // Show hint dialog after 2nd wrong attempt
const SKIP_THRESHOLD = 5; // Allow skip after 5th wrong attempt

interface HintState {
  attempts: Record<string, number>;
  showHintDialog: boolean;
  showHint: boolean;
  hintItemId: string | null;
  erroredItems: string[];
  skippedItems: string[];
}

export function useHintSystem() {
  const [state, setState] = useState<HintState>({
    attempts: {},
    showHintDialog: false,
    showHint: false,
    hintItemId: null,
    erroredItems: [],
    skippedItems: [],
  });

  const recordWrongAttempt = useCallback((itemId: string) => {
    setState((prev) => {
      const attempts = { ...prev.attempts };
      attempts[itemId] = (attempts[itemId] || 0) + 1;
      const count = attempts[itemId];

      if (count >= HINT_THRESHOLD && !prev.showHint) {
        return {
          ...prev,
          attempts,
          showHintDialog: true,
          hintItemId: itemId,
        };
      }
      return { ...prev, attempts };
    });
  }, []);

  const acceptHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showHintDialog: false,
      showHint: true,
    }));
  }, []);

  const declineHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showHintDialog: false,
      showHint: false,
    }));
  }, []);

  const dismissHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showHint: false,
      hintItemId: null,
    }));
  }, []);

  const canSkip = useCallback(
    (itemId: string) => {
      return (state.attempts[itemId] || 0) >= SKIP_THRESHOLD;
    },
    [state.attempts]
  );

  const skipItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      showHint: false,
      hintItemId: null,
      erroredItems: prev.erroredItems.includes(itemId)
        ? prev.erroredItems
        : [...prev.erroredItems, itemId],
      skippedItems: prev.skippedItems.includes(itemId)
        ? prev.skippedItems
        : [...prev.skippedItems, itemId],
    }));
  }, []);

  const addError = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      erroredItems: prev.erroredItems.includes(itemId)
        ? prev.erroredItems
        : [...prev.erroredItems, itemId],
    }));
  }, []);

  return {
    ...state,
    recordWrongAttempt,
    acceptHint,
    declineHint,
    dismissHint,
    canSkip,
    skipItem,
    addError,
  };
}
