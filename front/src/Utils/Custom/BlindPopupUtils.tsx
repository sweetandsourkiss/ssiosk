import { styled } from "styled-components";
import { CommonContainer } from "../Common/CommonContainer";

export const BlindPopup = styled(CommonContainer)`
  position: fixed;
  min-height: 750px;
  height: 80%;
  aspect-ratio: 3/2;
  margin: 0 auto;
  background-color: ${(props) => props.theme.bg.popup};
  border-radius: 100px;
  color: black;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  gap: 5%;
  padding: 2% 2%;
`;

export const BlindInfo = styled(CommonContainer)`
  width: 100%;
  height: 30vh;
  display: flex;
  align-items: center;
`;

export const BlindPopupMsg = styled(CommonContainer)`
  color: black;
  height: 100%;
  min-width: 450px;
  font-size: 48px;
  text-align: center;
  line-height: 150%;
  align-items: center;
`;
export const BlindPopupCircleContainer = styled.div`
  width: 100%;
  height: 55vh;
  display: flex;
  justify-content: center;
  gap: 5%;
`;
export const BlindPopupCircle = styled(CommonContainer)`
  width: 30%;
  min-width: 440px;
  min-height: 440px;
  aspect-ratio: 1/1;
  background-color: white;
  border-radius: 100%;
  cursor: pointer;
`;
export const BlindOSignImg = styled.img`
  width: 18vw;
  min-width: 330px;
  filter: invert(46%) sepia(17%) saturate(6774%) hue-rotate(163deg)
    brightness(98%) contrast(101%);
`;
export const BlindXSignImg = styled.img`
  width: 15vw;
  min-width: 275px;
  filter: invert(40%) sepia(59%) saturate(2825%) hue-rotate(332deg)
    brightness(104%) contrast(128%);
`;
