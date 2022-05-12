import { createMachine, assign } from 'xstate';

interface IGridCell {
  value: number;
  id: number;
}

type TGrid = (IGridCell | null)[][];

interface Card {
  x: number;
  y: number;
  value: number;
  id: number;
}

interface gameStateContext {
  seconds: number;
  score: number;
  cards: Card[];
}

const rotations: Record<string, number> = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
};

const createEmptyGrid = (n: number): TGrid => {
  const res = new Array(n);

  for (let i = 0; i < n; i++) {
    res[i] = new Array(n).fill(null);
  }

  return res;
};

const createStoppedGameState = (): gameStateContext => {
  return {
    seconds: 0,
    score: 0,
    cards: []
  };
};

const createInitialGameState = (): gameStateContext => {
  const res = createStoppedGameState();

  const x = Math.trunc(Math.random() * 4);
  const y = Math.trunc(Math.random() * 4);
  const id = Math.trunc(Math.random() * 1000);

  res.cards.push({
    x,
    y,
    value: 2,
    id
  });

  return res;
};

const buildGrid = (cards: Card[]): TGrid => {
  const grid = createEmptyGrid(4);

  cards.forEach((card) => {
    grid[card.x][card.y] = {
      value: card.value,
      id: card.id
    };
  });

  return grid;
};

const rotateLeft = (cards: Card[]): Card[] => {
  return cards.map(
    (card): Card => ({
      x: card.y,
      y: 3 - card.x,
      value: card.value,
      id: card.id
    })
  );
};

const rotateRight = (cards: Card[]): Card[] => {
  return cards.map(
    (card): Card => ({
      x: 3 - card.y,
      y: card.x,
      value: card.value,
      id: card.id
    })
  );
};

const handleMove = (cards: Card[], rotate: number): Card[] => {
  for (let i = 0; i < rotate; i++) {
    cards = rotateLeft(cards);
  }

  const grid = buildGrid(cards);

  for (let i = 0; i < 4; i++) {
    let prev: IGridCell | null = null;
    let canMerge = true;
    let pos = -1;

    const newRow = new Array<IGridCell | null>(4).fill(null);

    for (let j = 0; j < 4; j++) {
      const cell = grid[i][j];

      if (cell) {
        if (!prev || prev.value !== cell.value || !canMerge) {
          pos += 1;
          newRow[pos] = cell;
          prev = cell;
          canMerge = true;
        } else {
          newRow[pos] = cell;
          prev = cell;
          prev.value *= 2;
          canMerge = false;
        }
      }
    }

    grid[i] = newRow;
  }

  let newCards: Card[] = [];
  const emptySpaces = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = grid[i][j];

      if (!cell) {
        emptySpaces.push({ x: i, y: j });
      } else {
        newCards.push({
          x: i,
          y: j,
          id: cell.id,
          value: cell.value
        });
      }
    }
  }

  const n = emptySpaces.length;

  if (n > 0) {
    const { x, y } = emptySpaces[Math.trunc(Math.random() * n)];

    newCards.push({
      x,
      y,
      value: 2,
      id: Math.trunc(Math.random() * 1000)
    });
  }

  for (let i = 0; i < rotate; i++) {
    newCards = rotateRight(newCards);
  }

  return newCards;
};

/*
  TODO: Add new states
  - animating: waiting for board animations,
  - adding: adding a new card
*/

export const gameStateMachine = createMachine<gameStateContext>(
  {
    id: 'gameState',
    initial: 'stopped',
    context: createStoppedGameState(),
    states: {
      stopped: {
        on: {
          PLAY: {
            target: 'playing',
            actions: 'startGame'
          }
        }
      },
      playing: {
        invoke: {
          id: 'incInterval',
          src: () => (callback) => {
            const id = setInterval(() => callback('TICK'), 1000);

            // Perform cleanup
            return () => {
              clearInterval(id);
            };
          }
        },
        // always: [
        //   {
        //     cond: 'didWin',
        //     target: 'won'
        //   },
        //   {
        //     cond: 'didLose',
        //     target: 'lost'
        //   }
        // ],
        on: {
          TICK: {
            actions: 'increaseSeconds'
          },
          STOP: {
            target: 'stopped',
            actions: 'stopGame'
          },
          MOVE: {
            actions: 'move'
          }
        }
      }
    }
  },
  {
    actions: {
      increaseSeconds: assign({
        seconds: (context: gameStateContext, event) => context.seconds + 1
      }),
      startGame: assign(createInitialGameState()),
      stopGame: assign(createStoppedGameState()),
      move: assign({
        cards: (context, event) =>
          handleMove(context.cards, rotations[event.direction] || 0)
      })
    }
  }
);
