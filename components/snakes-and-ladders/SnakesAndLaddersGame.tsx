"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dice } from "@/components/snakes-and-ladders/Dice";
import { GameBoard } from "@/components/snakes-and-ladders/GameBoard";
import {
  applyMove,
  BOARD_SIZE,
  createPlayers,
  rollDice,
  type MoveResult,
  type Player,
} from "@/lib/snakes-and-ladders";
import { cn } from "@/lib/utils";

type LogEntry = {
  id: number;
  message: string;
  type?: "info" | "ladder" | "snake" | "win" | "blocked";
};

let logId = 0;

function formatMoveLog(
  player: Player,
  dice: number,
  result: MoveResult,
): LogEntry {
  if (result.blocked && !result.won) {
    return {
      id: ++logId,
      type: "blocked",
      message: `${player.name} rolled ${dice} — needs exact count to reach ${BOARD_SIZE}!`,
    };
  }
  if (result.won) {
    return {
      id: ++logId,
      type: "win",
      message: `🎉 ${player.name} wins! Landed on ${BOARD_SIZE}!`,
    };
  }
  if (result.type === "ladder") {
    return {
      id: ++logId,
      type: "ladder",
      message: `${player.name} rolled ${dice}, climbed a ladder ${result.landedOn} → ${result.newPosition}!`,
    };
  }
  if (result.type === "snake") {
    return {
      id: ++logId,
      type: "snake",
      message: `${player.name} rolled ${dice}, bitten by a snake ${result.landedOn} → ${result.newPosition}!`,
    };
  }
  return {
    id: ++logId,
    type: "info",
    message: `${player.name} rolled ${dice} and moved to ${result.newPosition}.`,
  };
}

export function SnakesAndLaddersGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(() => createPlayers(2));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastSquare, setLastSquare] = useState<number | undefined>();
  const [gameStarted, setGameStarted] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  const startGame = useCallback((count: number) => {
    setPlayerCount(count);
    setPlayers(createPlayers(count));
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setRolling(false);
    setWinner(null);
    setLog([{ id: ++logId, type: "info", message: "Game started! Roll the dice." }]);
    setLastSquare(undefined);
    setGameStarted(true);
  }, []);

  const roll = useCallback(() => {
    if (rolling || winner || !gameStarted) return;

    setRolling(true);
    setDiceValue(null);

    let ticks = 0;
    const interval = setInterval(() => {
      setDiceValue(rollDice());
      ticks += 1;
      if (ticks >= 8) {
        clearInterval(interval);
        const finalDice = rollDice();
        setDiceValue(finalDice);
        setRolling(false);

        const result = applyMove(currentPlayer.position, finalDice);
        setLastSquare(result.landedOn);

        const updatedPlayers = players.map((p, i) =>
          i === currentPlayerIndex
            ? { ...p, position: result.newPosition }
            : p,
        );
        setPlayers(updatedPlayers);
        setLog((prev) => [
          formatMoveLog(currentPlayer, finalDice, result),
          ...prev,
        ].slice(0, 12));

        if (result.won) {
          setWinner(updatedPlayers[currentPlayerIndex]);
        } else {
          setCurrentPlayerIndex((i) => (i + 1) % players.length);
        }
      }
    }, 80);
  }, [rolling, winner, gameStarted, currentPlayer, currentPlayerIndex, players]);

  if (!gameStarted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-4 py-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            🐍 Snakes &amp; Ladders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Race to square {BOARD_SIZE}. Climb ladders, dodge snakes, and roll
            your way to victory!
          </p>
        </header>

        <div className="w-full rounded-xl border border-border bg-card p-6 shadow-lg">
          <p className="mb-4 text-center font-medium">Choose players</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[2, 3, 4].map((n) => (
              <Button
                key={n}
                size="lg"
                variant={playerCount === n ? "default" : "outline"}
                onClick={() => setPlayerCount(n)}
              >
                {n} Players
              </Button>
            ))}
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={() => startGame(playerCount)}>
            Start Game
          </Button>
        </div>

        <RulesPanel />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">🐍 Snakes &amp; Ladders</h1>
          {winner ? (
            <p className="mt-1 text-lg font-semibold text-primary">
              {winner.name} wins! 🎉
            </p>
          ) : (
            <p className="mt-1 text-muted-foreground">
              <span
                className="mr-1.5 inline-block size-3 rounded-full align-middle"
                style={{ backgroundColor: currentPlayer.color }}
              />
              {currentPlayer.name}&apos;s turn
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => setGameStarted(false)}>
          New Game
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <GameBoard
          players={players}
          activePlayerId={currentPlayerIndex}
          highlightSquare={lastSquare}
        />

        <aside className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-lg">
            <Dice value={diceValue} rolling={rolling} />
            <Button
              size="lg"
              className="w-full"
              disabled={rolling || !!winner}
              onClick={roll}
            >
              {rolling ? "Rolling…" : winner ? "Game Over" : "Roll Dice"}
            </Button>
          </div>

          <PlayerScores players={players} activeId={currentPlayerIndex} winner={winner} />

          <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Game Log
            </h2>
            <ul className="max-h-48 space-y-1.5 overflow-y-auto text-sm">
              {log.map((entry) => (
                <li
                  key={entry.id}
                  className={cn(
                    "rounded-md px-2 py-1",
                    entry.type === "win" && "bg-primary/20 font-medium",
                    entry.type === "ladder" && "bg-emerald-500/10 text-emerald-400",
                    entry.type === "snake" && "bg-red-500/10 text-red-400",
                    entry.type === "blocked" && "text-muted-foreground",
                  )}
                >
                  {entry.message}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PlayerScores({
  players,
  activeId,
  winner,
}: {
  players: Player[];
  activeId: number;
  winner: Player | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Scores
      </h2>
      <ul className="space-y-2">
        {players.map((p) => (
          <li
            key={p.id}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
              p.id === activeId && !winner && "bg-muted",
              winner?.id === p.id && "bg-primary/20 font-semibold",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {p.position === 0 ? "Start" : p.position}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RulesPanel() {
  return (
    <div className="w-full rounded-xl border border-border bg-card/60 p-5 text-sm text-muted-foreground">
      <h2 className="mb-2 font-semibold text-foreground">How to play</h2>
      <ul className="list-inside list-disc space-y-1">
        <li>Take turns rolling a six-sided die and move forward.</li>
        <li>Ladders (green) boost you up; snakes (red) slide you down.</li>
        <li>You must land exactly on square 100 to win.</li>
        <li>If a roll would overshoot 100, your turn is skipped.</li>
      </ul>
    </div>
  );
}
