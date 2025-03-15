import { styled } from "styled-components";
import { CommonContainer } from "../Common/CommonContainer";

export const BlindSideSvgContainer = styled(CommonContainer)`
  width: 20%;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const BlindSideWhiteCircle = styled(CommonContainer)`
  width: 20vw;
  aspect-ratio: 1;
  min-width: 350px;
  min-height: 350px;
  border-radius: 100%;
  background-color: white;
  cursor: pointer;
`;

export const BlindSideSvg = styled.img`
  width: 25vw;
  aspect-ratio: 2/1;
  min-width: 450px;
`;
export const BlindSideChangeMode = styled(CommonContainer)`
  position: fixed;
  left: 2%;
  top: 4%;
  width: 200px;
  height: 40px;
  background-color: white;
  color: black;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;
