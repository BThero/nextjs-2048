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
  border: 2px solid purple;
`;

const Grid = styled.div`
  position: relative;
  width: 402px;
  height: 402px;
  border: 2px solid black;
`;

export { TwoCol, Card, Grid };
