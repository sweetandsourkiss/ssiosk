import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { customState, isBlind, nowBasket } from "../../atom";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { CommonContainer } from "../../Utils/Common/CommonContainer";

const Wrapper = styled(CommonContainer)`
  width: 100%;
  height: 100%;
  background-color: white;
  color: black;
  flex-direction: column;
  justify-content: center;
  padding: 5% 0;
  padding-bottom: 10%;
  gap: 5%;
`;
const Complete = styled.div<{ $isBlack: boolean }>`
  color: ${(props) => (props.$isBlack ? "black" : props.theme.text.red)};
  font-weight: bolder;
  font-size: 40px;
`;
const Msg = styled.div`
  font-weight: bolder;
  font-size: 20px;
`;
const ToMain = styled.div`
  position: fixed;
  left: 75%;
  top: 85%;
  font-size: 22px;
  font-weight: bold;
`;
function Order() {
  const history = useNavigate();
  const setBlind = useSetRecoilState(isBlind);
  const setCustom = useSetRecoilState(customState);
  const setBasket = useSetRecoilState(nowBasket);
  const [remainedSec, setRemainedSec] = useState(5);
  const [nowKey, setNowKey] = useState(-1);
  const toMain = () => {
    history("/");
    setBlind(false);
    setBasket([]);
    setCustom("");
  };
  useEffect(() => {
    const handleKeyDown = async (event: any) => {
      setNowKey(event.keyCode);
      const key = event.keyCode;
      if (key >= 48 && key <= 57) {
        toMain();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nowKey]);
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log(remainedSec);
      setRemainedSec((prev) => prev - 1);
    }, 1000); // 시간 간격을 1000ms(1초)로 변경

    setTimeout(() => {
      clearInterval(interval); // 인터벌을 정리해줘야 합니다.
      toMain();
    }, 5000);
  }, []);
  return (
    <Wrapper>
      <img
        src="https://video-public.canva.com/VAEU_ffvXkU/v/2069f3e049.gif"
        width={150}
        height={150}
        alt=""
      />
      <Complete $isBlack={false}>주문 완료</Complete>
      <Complete $isBlack={true}>맛있게 만들어 드리겠습니다</Complete>
      <Msg>초기화면으로 이동합니다...{remainedSec}</Msg>

      <ToMain onClick={toMain}>초기 화면으로 이동 {">"}</ToMain>
    </Wrapper>
  );
}

export default Order;
