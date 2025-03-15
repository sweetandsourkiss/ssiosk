import { motion } from "framer-motion";
import { styled } from "styled-components";

export const CommonButton = styled(motion.button)`
  width: fit-content;
  height: fit-content;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  border-width: 0;
  color: white;
  font-size: 28px;
  cursor: pointer;
`;
