import React from 'react';
import * as S from './Header.styled';
import Link from 'next/link';

const Header = () => {
  return (
    <S.Header>
      <S.Title>2048</S.Title>
      <nav>
        <S.NavList>
          <S.NavItem>
            <Link href="/">
              <a>Play</a>
            </Link>
          </S.NavItem>
          <S.NavItem>
            <Link href="/leaderboard">
              <a>Leaderboard</a>
            </Link>
          </S.NavItem>
        </S.NavList>
      </nav>
    </S.Header>
  );
};

export default Header;
