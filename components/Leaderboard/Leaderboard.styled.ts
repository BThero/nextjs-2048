import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
`;

const List = styled.ul`
  list-style-type: none;
`;

const Item = styled.li`
  font-size: 1.5rem;
`;

export { Container, Title, List, Item };
