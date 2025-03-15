import { motion } from "framer-motion";
import { styled } from "styled-components";

export const CommonWhiteOverlay = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.6);
`;
