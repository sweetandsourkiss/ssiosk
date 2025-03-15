import { motion } from "framer-motion";
import { styled } from "styled-components";

export const CommonScrollDiv = styled(motion.div)`
  overflow: scroll;
  scrollbar-width: thin;
  scrollbar-color: #888 #f3f3f3;
  scroll-behavior: smooth;
  ::-webkit-scrollbar,
  ::-webkit-scrollbar-track {
    width: 0;
  }
  /* &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f3f3f3;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  } */
`;
