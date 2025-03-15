import { motion } from "framer-motion";
import { styled } from "styled-components";

export const CommonBigModal = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 900px;
  height: 80%;
  left: 0;
  right: 0;
  top: 10%;
  padding: 2% 0;
  margin: 0 auto;
  border-radius: 15px;
  background-color: ${(props) => props.theme.bg.pink};
  border: solid 20px white;
  font-size: 16px;
  color: black;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
