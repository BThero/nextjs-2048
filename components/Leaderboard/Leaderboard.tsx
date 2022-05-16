import React from 'react';
import { fetchRecords } from 'services/data';
import * as S from './Leaderboard.styled';

const Leaderboard = () => {
  const data = fetchRecords();

  return (
    <S.Container>
      <S.Title>Leaderboard</S.Title>
      <S.List>
        {data.map((item, idx) => (
          <S.Item key={idx}>
            {idx + 1}. {item.score} points in {item.seconds} seconds
          </S.Item>
        ))}
      </S.List>
    </S.Container>
  );
};

export default Leaderboard;
