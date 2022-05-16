import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  padding: 2rem;
  background-color: rebeccapurple;
  align-items: center;
  justify-content: space-around;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
`;

const NavList = styled.ul`
  display: flex;
  gap: 1rem;
  list-style-type: none;
`;

const NavItem = styled.li`
  font-size: 1.25rem;

  &:hover {
    color: pink;
    cursor: pointer;
  }
`;

export { Header, Title, NavList, NavItem };
