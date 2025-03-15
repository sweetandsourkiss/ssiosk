import { styled } from "styled-components";
import { CommonScrollDiv } from "./CommonScrollDiv";

export const CommonGrid = styled(CommonScrollDiv)`
  width: 90%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: max-content;
  justify-content: flex-start;
  justify-items: center;
  padding: 2% 0;
  gap: 20px;
`;
