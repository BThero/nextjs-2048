import React from 'react';
import * as S from './Header.styled';

const Header = () => {
  return (
    <S.Header>
      2048
      <nav>
        <ul>
          <li>Play</li>
          <li>Leaderboard</li>
        </ul>
      </nav>
    </S.Header>
  );
};

export default Header;
