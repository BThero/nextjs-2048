import styled from 'styled-components';
import { motion } from 'framer-motion';

const TwoCol = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: orange;
  color: white;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
`;

const Cell = styled.div`
  background-color: lightgray;
  border: none;
  border-radius: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 100px);
  grid-template-rows: repeat(4, 100px);
  gap: 20px;
  position: relative;
  background-color: darkgray;
  box-sizing: content-box;
  border: 2px solid black;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem;
`;

export { TwoCol, Card, Grid, Cell };
