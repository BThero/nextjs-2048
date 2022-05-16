import React, { useMemo, useEffect, useState, useCallback } from 'react';
import * as S from './Playground.styled';
import { gameStateMachine } from './gameStateMachine';
import { useMachine } from '@xstate/react';
import { AnimatePresence } from 'framer-motion';
import Button from 'components/Button';

const genRandomColor = (): string => {
  const r = 64 + Math.trunc(Math.random() * 192);
  const g = 64 + Math.trunc(Math.random() * 192);
  const b = 64 + Math.trunc(Math.random() * 192);
  return `rgb(${r}, ${g}, ${b})`;
};

const genRandomColorSet = (): Record<number, string> => {
  const res: Record<number, string> = {};

  for (let i = 2, j = 0; j < 30; i *= 2, j += 1) {
    res[i] = genRandomColor();
  }

  return res;
};

const valueColors = genRandomColorSet();

const getPosition = (x: number): number => {
  return 16 + x * 100 + x * 20;
};

const getDirection = (key: string): string => {
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

  const MemoGridBackground = useMemo(
    () => (
      <>
        {[...new Array(16)].map((_, i) => (
          <S.Cell key={i} />
        ))}
      </>
    ),
    []
  );

  const MemoCards = useMemo(
    () => (
      <AnimatePresence>
        {state.context.cards.map((card) => (
          <S.Card
            key={card.id}
            initial={{
              x: getPosition(card.x),
              y: getPosition(card.y),
              opacity: 0,
              backgroundColor: valueColors[card.value]
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
    ),
    [state.context.cards]
  );

  const handleClick = useCallback(() => {
    if (state.value === 'stopped') {
      send('PLAY');
    } else {
      send('STOP');
    }
  }, [send, state.value]);

  const MemoScore = useMemo(
    () => <S.Score>Score: {state.context.score}</S.Score>,
    [state.context.score]
  );

  const MemoCounter = useMemo(
    () => <S.Counter>{state.context.seconds} seconds</S.Counter>,
    [state.context.seconds]
  );

  const MemoButton = useMemo(
    () => (
      <Button
        onClick={handleClick}
        text={state.value === 'stopped' ? 'Start game' : 'Stop game'}
      />
    ),
    [state.value, handleClick]
  );

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      const direction = getDirection(e.key);

      if (direction.length > 0) {
        send({
          type: 'MOVE',
          direction
        });
      }
    };

    window.addEventListener('keydown', keyPressHandler);

    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [send]);

  return (
    <S.TwoCol>
      <S.Grid>
        {MemoGridBackground}
        {MemoCards}
      </S.Grid>

      <S.InfoWrapper>
        {MemoButton}
        {MemoScore}
        {MemoCounter}
      </S.InfoWrapper>
    </S.TwoCol>
  );
};

export default Playground;
