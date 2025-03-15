import { styled } from "styled-components";
import { CommonContainer } from "./CommonContainer";

export const CommonGridElement = styled(CommonContainer)`
  width: 90%;
  min-width: 250px;
  aspect-ratio: 1 / 1;
  background-color: white;
  color: black;
  border-radius: 40px;
  padding: 10px;
  font-size: 20px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
`;
