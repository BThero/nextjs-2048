import React, { useEffect, useState } from 'react';
import * as S from './Playground.styled';
import { gameStateMachine } from './gameStateMachine';
import { useMachine } from '@xstate/react';
import { AnimatePresence, motion } from 'framer-motion';

const genRandomColor = (): string => {
  const r = Math.trunc(Math.random() * 256);
  const g = Math.trunc(Math.random() * 256);
  const b = Math.trunc(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

const genRandomColorSet = (): Record<number, string> => {
  const res: Record<number, string> = {};

  for (let i = 2; i <= 8096; i *= 2) {
    res[i] = genRandomColor();
  }

  return res;
};

const valueColors = genRandomColorSet();

const getPosition = (x: number): number => {
  return 16 + x * 100 + x * 20;
};

const getDirection = (key: string): string => {
  console.log(key);

  switch (key) {
    case 'ArrowLeft':
      return 'left';
    case 'ArrowUp':
      return 'up';
    case 'ArrowRight':
      return 'right';
    case 'ArrowDown':
      return 'down';
    default:
      return '';
  }
};

const Playground = () => {
  const [state, send] = useMachine(gameStateMachine);

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      const direction = getDirection(e.key);
      console.log(direction);

      send({
        type: 'MOVE',
        direction
      });
    };

    window.addEventListener('keydown', keyPressHandler);

    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [send]);

  return (
    <S.TwoCol>
      <S.Grid>
        {[...new Array(16)].map((_, i) => (
          <S.Cell key={i} />
        ))}

        <AnimatePresence>
          {state.context.cards.map((card) => (
            <S.Card
              key={card.id}
              initial={{
                x: getPosition(card.x),
                y: getPosition(card.y),
                opacity: 0
              }}
              animate={{
                x: getPosition(card.x),
                y: getPosition(card.y),
                opacity: 1,
                backgroundColor: valueColors[card.value]
              }}
              transition={{
                duration: 0.2
              }}
              exit={{
                opacity: 0,
                scale: 0
              }}
            >
              {card.value}
            </S.Card>
          ))}
        </AnimatePresence>
      </S.Grid>

      <div>
        {state.value === 'stopped' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              send('PLAY');
            }}
          >
            Start game
          </button>
        )}

        {state.value !== 'stopped' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              send('STOP');
            }}
          >
            Stop game
          </button>
        )}

        <p>{state.value as string}</p>
        <p>Score: {state.context.score}</p>
        <p>{state.context.seconds} seconds</p>
      </div>
    </S.TwoCol>
  );
};

export default Playground;
