import React from 'react';
import * as S from './Button.styled';

interface IButtonProps {
  text: string;
  onClick: () => void;
}

const Button = ({ text, onClick }: IButtonProps) => {
  return (
    <S.Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {text}
    </S.Button>
  );
};

export default Button;
