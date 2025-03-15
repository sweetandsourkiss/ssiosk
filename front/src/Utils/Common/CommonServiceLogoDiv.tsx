import { styled } from "styled-components";

export const CommonServiceLogoDiv = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  font-size: 44px;
  font-weight: bolder;
  justify-content: start;
  align-items: center;
  color: ${(props) => props.theme.text.greenBlue};
`;
