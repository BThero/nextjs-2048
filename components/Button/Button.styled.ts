import styled from 'styled-components';

const Button = styled.button`
  border: 2px solid black;
  font-size: 2rem;
  padding: 1rem;
  background-color: #222;
  color: white;
  border-radius: 0.75rem;

  &:hover {
    color: pink;
  }

  &:focus {
    outline: none;
  }
`;

export { Button };
