import { styled } from "styled-components";
import { CommonContainer } from "../Common/CommonContainer";

export const BlindWrapper = styled(CommonContainer)`
  width: 100vw;
  height: 100vh;
  background-color: black;
  padding: 0 5%;
`;

export const BlindGrid = styled.div`
  display: grid;
  width: fit-content;
  min-width: 1000px;
  min-height: 800px;
  grid-template-columns: 13% 50% 13%;
  grid-template-rows: 18% 60% 18%;
  gap: 1%;
  justify-content: center;
  justify-items: center;
  align-content: center;
  height: 100%;
`;
export const BlindGridCenter = styled(CommonContainer)`
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 2/3;
  border-radius: 40px;
  background-color: white;
`;
export const BlineGridArrow = styled.img<{
  $deg: string;
  $gCol: string;
  $gRow: string;
  $isNext: boolean;
}>`
  width: 100%;
  height: 100%;
  cursor: pointer;
  max-width: fit-content;
  aspect-ratio: 1/1;
  filter: invert(100%) brightness(100%);
`;
