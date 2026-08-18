export const BOARD_SIZE = 100;
export const GRID_COLS = 10;

export type Player = {
  id: number;
  name: string;
  color: string;
  position: number;
};

export type SnakeOrLadder = {
  from: number;
  to: number;
};

/** Classic snakes-and-ladders layout (bottom → top on the board). */
export const LADDERS: SnakeOrLadder[] = [
  { from: 4, to: 14 },
  { from: 9, to: 31 },
  { from: 16, to: 36 },
  { from: 28, to: 84 },
  { from: 51, to: 67 },
  { from: 71, to: 91 },
  { from: 80, to: 100 },
];

export const SNAKES: SnakeOrLadder[] = [
  { from: 17, to: 7 },
  { from: 47, to: 26 },
  { from: 49, to: 11 },
  { from: 56, to: 53 },
  { from: 62, to: 19 },
  { from: 64, to: 60 },
  { from: 87, to: 24 },
  { from: 93, to: 73 },
  { from: 95, to: 75 },
  { from: 98, to: 78 },
];

export const PLAYER_COLORS = ["#ef4444", "#3b82f6", "#eab308", "#a855f7"] as const;

export function createPlayers(count: number): Player[] {
  const names = ["Red", "Blue", "Yellow", "Purple"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: names[i] ?? `Player ${i + 1}`,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    position: 0,
  }));
}

/** Serpentine board: row 0 at top, square 100 at top-right. */
export function cellNumber(row: number, col: number): number {
  const bottomRow = GRID_COLS - 1 - row;
  if (bottomRow % 2 === 0) {
    return bottomRow * GRID_COLS + col + 1;
  }
  return bottomRow * GRID_COLS + (GRID_COLS - col);
}

export function getLadderAt(square: number): SnakeOrLadder | undefined {
  return LADDERS.find((l) => l.from === square);
}

export function getSnakeAt(square: number): SnakeOrLadder | undefined {
  return SNAKES.find((s) => s.from === square);
}

export type MoveResult = {
  newPosition: number;
  landedOn: number;
  snakeOrLadder?: SnakeOrLadder;
  type?: "ladder" | "snake";
  blocked: boolean;
  won: boolean;
};

export function applyMove(currentPosition: number, dice: number): MoveResult {
  if (currentPosition === BOARD_SIZE) {
    return {
      newPosition: BOARD_SIZE,
      landedOn: BOARD_SIZE,
      blocked: true,
      won: true,
    };
  }

  const target = currentPosition + dice;

  if (target > BOARD_SIZE) {
    return {
      newPosition: currentPosition,
      landedOn: currentPosition,
      blocked: true,
      won: false,
    };
  }

  const ladder = getLadderAt(target);
  if (ladder) {
    return {
      newPosition: ladder.to,
      landedOn: target,
      snakeOrLadder: ladder,
      type: "ladder",
      blocked: false,
      won: ladder.to === BOARD_SIZE,
    };
  }

  const snake = getSnakeAt(target);
  if (snake) {
    return {
      newPosition: snake.to,
      landedOn: target,
      snakeOrLadder: snake,
      type: "snake",
      blocked: false,
      won: false,
    };
  }

  return {
    newPosition: target,
    landedOn: target,
    blocked: false,
    won: target === BOARD_SIZE,
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}
