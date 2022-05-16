import { createMachine, assign } from 'xstate';
import { peekId, addRecord } from 'services/data';

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

const addRandomCard = (cards: Card[]): Card[] => {
  const emptySpaces = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!cards.find((item) => item.x == i && item.y == j)) {
        emptySpaces.push({ x: i, y: j });
      }
    }
  }

  const n = emptySpaces.length;

  if (n > 0) {
    const { x, y } = emptySpaces[Math.trunc(Math.random() * n)];
    const id = peekId();

    cards.push({
      x,
      y,
      value: 2,
      id
    });
  }

  return cards;
};

interface IhandleMoveReturn {
  cards: Card[];
  score: number;
}

const handleMove = (
  cards: Card[],
  rotate: number,
  score: number
): IhandleMoveReturn => {
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
          score += cell.value;

          cell.value *= 2;
          prev = cell;
          canMerge = false;
        }
      }
    }

    grid[i] = newRow;
  }

  cards = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = grid[i][j];

      if (cell) {
        cards.push({
          x: i,
          y: j,
          id: cell.id,
          value: cell.value
        });
      }
    }
  }

  for (let i = 0; i < rotate; i++) {
    cards = rotateRight(cards);
  }

  return { cards, score };
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
  res.cards = addRandomCard(res.cards);
  return res;
};

const playingSubstates = {
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        MOVE: {
          actions: 'move',
          target: 'moving'
        }
      }
    },
    moving: {
      invoke: {
        id: 'animationDelay',
        src: () =>
          new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
              clearTimeout(timer);
              resolve(true);
            }, 400);
          }),
        onDone: 'adding'
      }
    },
    adding: {
      always: [
        {
          cond: 'didLose',
          target: 'recording'
        },
        {
          actions: 'addRandomCard',
          target: 'waiting'
        }
      ]
    },
    recording: {
      always: {
        actions: 'recordGame',
        target: '#stopped'
      }
    }
  }
};

export const gameStateMachine = createMachine<gameStateContext>(
  {
    id: 'gameState',
    initial: 'stopped',
    context: createStoppedGameState(),
    states: {
      stopped: {
        id: 'stopped',
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

            return () => {
              clearInterval(id);
            };
          }
        },
        on: {
          TICK: {
            actions: 'increaseSeconds'
          },
          STOP: {
            target: 'playing.recording'
          }
        },
        ...playingSubstates
      }
    }
  },
  {
    guards: {
      didLose(context) {
        return context.cards.length === 16;
      }
    },
    actions: {
      increaseSeconds: assign({
        seconds: (context: gameStateContext, event) => context.seconds + 1
      }),
      startGame: assign(createInitialGameState()),
      stopGame: assign(createStoppedGameState()),
      move: assign((context: gameStateContext, event) =>
        handleMove(context.cards, rotations[event.direction], context.score)
      ),
      addRandomCard: assign({
        cards: (context, event) => addRandomCard(context.cards)
      }),
      recordGame: (context, event) => {
        addRecord(context.score, context.seconds);
      }
    }
  }
);
