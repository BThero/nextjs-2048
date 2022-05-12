import React, { useEffect, useState } from 'react';
import * as S from './Playground.styled';
import { gameStateMachine } from './gameStateMachine';
import { useMachine } from '@xstate/react';
import { motion } from 'framer-motion';
import { send } from 'process';

const COLORS: Record<number, string> = {
  2048: ''
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
        {state.context.cards.map((card) => (
          <S.Card
            key={card.id}
            initial={{ x: card.x * 100, y: card.y * 100, opacity: 0 }}
            animate={{
              x: card.x * 100,
              y: card.y * 100,
              opacity: 1
            }}
          >
            {card.value}
          </S.Card>
        ))}
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

        {state.value === 'playing' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              send('STOP');
            }}
          >
            Stop game
          </button>
        )}

        <p>Score: {state.context.score}</p>
        <p>{state.context.seconds} seconds</p>
      </div>
    </S.TwoCol>
  );
};

export default Playground;
