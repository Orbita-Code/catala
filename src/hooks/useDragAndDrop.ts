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

  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  // Document-level pointermove listener
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

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
    };

    const handleUp = (e: PointerEvent) => {
      if (!dragRef.current) return;

      if (dragRef.current.moved && onDropRef.current) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const targetEl = el?.closest("[data-drop-target]") as HTMLElement | null;
        if (targetEl) {
          const targetId = targetEl.getAttribute("data-drop-target");
          if (targetId) {
            onDropRef.current(dragRef.current.item, targetId);
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
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dragRef.current) {
        dragRef.current = null;
        setDragState({
          isDragging: false,
          draggedItem: null,
          dragPosition: null,
          dragSource: null,
        });
      }
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    document.addEventListener("pointercancel", handleUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePointerDown = useCallback(
    (item: string, source: string, e: React.PointerEvent) => {
      if (disabledRef.current) return;
      e.preventDefault();
      dragRef.current = {
        item,
        source,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    },
    []
  );

  return {
    dragState,
    handlePointerDown,
  };
}
