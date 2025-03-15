import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonContainer } from "../Utils/Common/CommonContainer";

const Wrapper = styled(CommonContainer)`
  width: 100vw;
  height: 100vh;
  background-color: white;
  color: black;
  flex-direction: column;
  justify-content: center;
  padding: 5% 0;
  padding-bottom: 10%;
  font-size: 40px;
  gap: 3%;
`;
const Black = styled.div`
  font-weight: bolder;
`;
const Red = styled.div`
  color: ${(props) => props.theme.text.red};
  font-weight: bolder;
`;
const ToMain = styled.div`
  position: fixed;
  left: 75%;
  top: 85%;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
`;

function NotFound() {
  const history = useNavigate();
  const toMain = () => {
    history("/");
  };
  return (
    <Wrapper>
      <img
        src="https://video-public.canva.com/VAEU_ffvXkU/v/2069f3e049.gif"
        width={150}
        height={150}
        alt=""
      />
      <Black>404</Black>
      <Red>Not Found</Red>
      <Black>페이지를 찾을 수 없습니다</Black>
      <ToMain onClick={toMain}>초기 화면으로 이동 {">"}</ToMain>
    </Wrapper>
  );
}
export default NotFound;
