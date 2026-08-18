"use client";

import { cn } from "@/lib/utils";

const DOT_POSITIONS: Record<number, string[]> = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "mid-left", "mid-right", "bottom-left", "bottom-right"],
};

const POSITION_CLASSES: Record<string, string> = {
  "top-left": "col-start-1 row-start-1",
  "top-right": "col-start-3 row-start-1",
  "mid-left": "col-start-1 row-start-2",
  "mid-right": "col-start-3 row-start-2",
  center: "col-start-2 row-start-2",
  "bottom-left": "col-start-1 row-start-3",
  "bottom-right": "col-start-3 row-start-3",
};

type DiceProps = {
  value: number | null;
  rolling?: boolean;
};

export function Dice({ value, rolling }: DiceProps) {
  const display = value ?? 1;
  const dots = DOT_POSITIONS[display] ?? [];

  return (
    <div
      className={cn(
        "grid size-16 grid-cols-3 grid-rows-3 gap-1 rounded-xl border-2 border-border bg-card p-2 shadow-lg sm:size-20",
        rolling && "animate-pulse",
      )}
      aria-label={value ? `Dice showing ${value}` : "Dice"}
    >
      {dots.map((pos) => (
        <span
          key={pos}
          className={cn(
            "size-2.5 self-center justify-self-center rounded-full bg-foreground sm:size-3",
            POSITION_CLASSES[pos],
          )}
        />
      ))}
    </div>
  );
}
