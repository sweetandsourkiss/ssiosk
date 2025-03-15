import { useRecoilState } from "recoil";
import {
  STATE_BASKET,
  STATE_MENU,
  STATE_ORDER,
  customState,
  isBlind,
} from "../atom";
import { styled } from "styled-components";
import OrderComplete from "../Components/Custom/OrderComplete";
import MenuBlind from "./../Components/Custom/MenuBlind";
import BasketBlind from "../Components/Custom/BasketBlind";
import OrderNotBlind from "../Components/Custom/OrderNotBlind";
import { useEffect } from "react";
import { CommonContainer } from "../Utils/Common/CommonContainer";
/** 전체 */
const Wrapper = styled(CommonContainer)`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  user-select: none; // 드래그 방지
`;
function Custom() {
  /** Recoil */
  const [blind, setBlind] = useRecoilState(isBlind);
  const [custom, setCustom] = useRecoilState(customState);
  /** 최초 렌더링 시 실행 */
  useEffect(() => {
    setCustom(STATE_MENU);
    setBlind(false);
  }, []);
  return (
    <Wrapper>
      {!blind ? (
        <>
          {custom === STATE_MENU && <OrderNotBlind />}
          {custom === STATE_ORDER && <OrderComplete />}
        </>
      ) : (
        <>
          {custom === STATE_MENU && <MenuBlind />}
          {custom === STATE_BASKET && <BasketBlind />}
          {custom === STATE_ORDER && <OrderComplete />}
        </>
      )}
    </Wrapper>
  );
}

export default Custom;
