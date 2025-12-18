"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  disableOverflow?: boolean;
  preventPropagation?: boolean;
  onScrollEnd?: () => void;
}

function ScrollArea({
  className,
  children,
  disableOverflow = false,
  preventPropagation = false,
  onScrollEnd,
  ...props
}: ScrollAreaProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (preventPropagation) {
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (preventPropagation) {
      e.stopPropagation();
    }
  };

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onScrollEnd) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const threshold = 50; // Píxeles antes del final para activar

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        onScrollEnd();
      }
    },
    [onScrollEnd]
  );

  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1",
          disableOverflow && "[&>[data-radix-scroll-area-viewport]]:!overflow-visible"
        )}
        style={disableOverflow ? { overflow: "visible" } : undefined}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onScroll={handleScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {!disableOverflow && <ScrollBar />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
