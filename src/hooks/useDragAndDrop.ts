"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface DragState {
  isDragging: boolean;
  draggedItem: string | null;
  dragPosition: { x: number; y: number } | null;
  dragSource: string | null;
}

interface UseDragAndDropOptions {
  onDrop?: (item: string, targetId: string) => void;
  disabled?: boolean;
}

export function useDragAndDrop({ onDrop, disabled = false }: UseDragAndDropOptions = {}) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragPosition: null,
    dragSource: null,
  });

  const dragRef = useRef<{
    item: string;
    source: string;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const dropTargetsRef = useRef<Map<string, DOMRect>>(new Map());

  const registerDropTarget = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      dropTargetsRef.current.set(id, element.getBoundingClientRect());
    } else {
      dropTargetsRef.current.delete(id);
    }
  }, []);

  const refreshDropTargets = useCallback(() => {
    // Targets are refreshed on each pointer move via data attributes
  }, []);

  const handlePointerDown = useCallback(
    (item: string, source: string, e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = {
        item,
        source,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      // Start drag after 5px movement to distinguish from taps
      if (!dragRef.current.moved && Math.abs(dx) + Math.abs(dy) > 5) {
        dragRef.current.moved = true;
        setDragState({
          isDragging: true,
          draggedItem: dragRef.current.item,
          dragPosition: { x: e.clientX, y: e.clientY },
          dragSource: dragRef.current.source,
        });
      }

      if (dragRef.current.moved) {
        setDragState((prev) => ({
          ...prev,
          dragPosition: { x: e.clientX, y: e.clientY },
        }));
      }
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;

      if (dragRef.current.moved && onDrop) {
        // Find drop target under pointer
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const targetEl = el?.closest("[data-drop-target]") as HTMLElement | null;
        if (targetEl) {
          const targetId = targetEl.getAttribute("data-drop-target");
          if (targetId) {
            onDrop(dragRef.current.item, targetId);
          }
        }
      }

      dragRef.current = null;
      setDragState({
        isDragging: false,
        draggedItem: null,
        dragPosition: null,
        dragSource: null,
      });
    },
    [onDrop]
  );

  const cancelDrag = useCallback(() => {
    dragRef.current = null;
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragPosition: null,
      dragSource: null,
    });
  }, []);

  // Cancel on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelDrag();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelDrag]);

  return {
    dragState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    registerDropTarget,
    refreshDropTargets,
    cancelDrag,
  };
}
