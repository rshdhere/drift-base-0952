"use client";

import { cn } from "@/lib/utils";
import {
  BOARD_SIZE,
  cellNumber,
  GRID_COLS,
  LADDERS,
  type Player,
  SNAKES,
} from "@/lib/snakes-and-ladders";

type GameBoardProps = {
  players: Player[];
  activePlayerId: number;
  highlightSquare?: number;
};

function SnakeLadderOverlay() {
  const size = 100;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {LADDERS.map(({ from, to }) => (
        <BoardLink key={`l-${from}`} from={from} to={to} kind="ladder" />
      ))}
      {SNAKES.map(({ from, to }) => (
        <BoardLink key={`s-${from}`} from={from} to={to} kind="snake" />
      ))}
    </svg>
  );
}

function BoardLink({
  from,
  to,
  kind,
}: {
  from: number;
  to: number;
  kind: "ladder" | "snake";
}) {
  const [x1, y1] = squareCenter(from);
  const [x2, y2] = squareCenter(to);
  const isLadder = kind === "ladder";

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isLadder ? "#22c55e" : "#ef4444"}
      strokeWidth={isLadder ? 1.2 : 1.5}
      strokeDasharray={isLadder ? "3 2" : undefined}
      strokeLinecap="round"
      opacity={0.85}
    />
  );
}

function squareCenter(num: number): [number, number] {
  const row = Math.floor((BOARD_SIZE - num) / GRID_COLS);
  const bottomRow = GRID_COLS - 1 - row;
  const colInRow =
    bottomRow % 2 === 0
      ? (num - 1) % GRID_COLS
      : GRID_COLS - 1 - ((num - 1) % GRID_COLS);
  const x = colInRow * 10 + 5;
  const y = row * 10 + 5;
  return [x, y];
}

function tokensOnSquare(players: Player[], square: number): Player[] {
  return players.filter((p) => p.position === square);
}

export function GameBoard({
  players,
  activePlayerId,
  highlightSquare,
}: GameBoardProps) {
  const rows = Array.from({ length: GRID_COLS }, (_, row) =>
    Array.from({ length: GRID_COLS }, (_, col) => cellNumber(row, col)),
  );

  return (
    <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-xl border-2 border-border bg-card shadow-xl">
      <SnakeLadderOverlay />
      <div className="relative grid h-full w-full grid-cols-10 grid-rows-10">
        {rows.flatMap((rowCells, row) =>
          rowCells.map((num) => {
            const tokens = tokensOnSquare(players, num);
            const isStart = num === 1;
            const isFinish = num === BOARD_SIZE;
            const isHighlighted = highlightSquare === num;

            return (
              <div
                key={num}
                className={cn(
                  "relative flex flex-col items-center justify-center border border-border/40 text-[0.55rem] font-medium sm:text-[0.65rem]",
                  (row + Math.floor((num - 1) / GRID_COLS)) % 2 === 0
                    ? "bg-muted/30"
                    : "bg-background/40",
                  isStart && "bg-emerald-500/15",
                  isFinish && "bg-amber-500/20",
                  isHighlighted && "ring-2 ring-inset ring-primary",
                )}
              >
                <span className="text-muted-foreground">{num}</span>
                {isFinish && (
                  <span className="text-[0.45rem] text-amber-400 sm:text-[0.5rem]">
                    🏁
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0.5 flex justify-center gap-0.5">
                  {tokens.map((player) => (
                    <span
                      key={player.id}
                      title={player.name}
                      className={cn(
                        "size-2.5 rounded-full border border-white/80 shadow sm:size-3",
                        player.id === activePlayerId && "ring-1 ring-white",
                      )}
                      style={{ backgroundColor: player.color }}
                    />
                  ))}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
