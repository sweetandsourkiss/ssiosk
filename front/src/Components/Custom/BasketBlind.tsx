import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import {
  IMenu,
  STATE_MENU,
  STATE_ORDER,
  customState,
  deletePopup,
  isBlind,
  nowBasket,
  orderPopup,
  totalMenus,
} from "../../atom";
import Arrow from "../../Svg/Arrow.svg";
import {
  changeBasket,
  deleteQuestion,
  deleteResult,
  initBasket,
  moveBasket,
  selectBasket,
} from "../../Api/Rpi/BlindBasketApis";
import { addOrder } from "../../Api/Spring/OrderApis";
import { getMenus } from "../../Api/Spring/MenuApis";
import { completeOrder } from "../../Api/Rpi/MainApis";
import Notification from "../../Svg/Notification.svg";
import Menu from "../../Svg/Menu.svg";
import {
  BlindInfo,
  BlindOSignImg,
  BlindPopup,
  BlindPopupCircle,
  BlindPopupCircleContainer,
  BlindPopupMsg,
  BlindXSignImg,
} from "../../Utils/Custom/BlindPopupUtils";
import {
  BlindGrid,
  BlindGridCenter,
  BlindWrapper,
  BlineGridArrow,
} from "../../Utils/Custom/BlindMainUtils";
import {
  BlindSideChangeMode,
  BlindSideSvg,
  BlindSideSvgContainer,
  BlindSideWhiteCircle,
} from "../../Utils/Custom/BlindSideUtils";
import { CommonWhiteOverlay } from "../../Utils/Common/CommonWhiteOverlay";
import { CommonImgLikeDiv } from "../../Utils/Common/CommonImgLikeDiv";

const Wrapper = styled(BlindWrapper)``;
const SvgContainer = styled(BlindSideSvgContainer)``;
const Circle = styled(BlindSideWhiteCircle)``;
const Svg = styled(BlindSideSvg)``;
const ChangeMode = styled(BlindSideChangeMode)``;
const WhiteOverlay = styled(CommonWhiteOverlay)``;
const Popup = styled(BlindPopup)``;
const Info = styled(BlindInfo)``;
const PopupMsg = styled(BlindPopupMsg)``;
const PopupCircleContainer = styled(BlindPopupCircleContainer)``;
const PopupCircle = styled(BlindPopupCircle)``;
const OMark = styled(BlindOSignImg)``;
const XMark = styled(BlindXSignImg)``;
const Grid = styled(BlindGrid)``;
const Center = styled(BlindGridCenter)`
  border: ${(props) => `40px solid ${props.theme.btn.yellow.shadow}`};
`;
const Img = styled(CommonImgLikeDiv)<{ $image: string }>`
  width: 70%;
  min-height: 250px;
  background-image: ${(props) =>
    props.$image
      ? `url(${props.$image})`
      : "url(https://cdn-icons-png.flaticon.com/512/10701/10701484.png)"};
`;
const MenuArrow = styled(BlineGridArrow)<{
  $deg: string;
  $gCol: string;
  $gRow: string;
  $isNext: boolean;
}>`
  grid-column: ${(props) => props.$gCol};
  grid-row: ${(props) => props.$gRow};
  transform: ${(props) => "rotate(" + props.$deg + "deg)"};
`;
function BasketBlind() {
  /** States */
  const [menus, setMenus] = useRecoilState(totalMenus);
  const [basket, setBasket] = useRecoilState(nowBasket);
  const [nowMenu, setNowMenu] = useState(basket[0]);
  const [nowKey, setNowKey] = useState(-1);
  const setCustom = useSetRecoilState(customState);
  const [isDeletePopup, setIsDeletePopup] = useRecoilState(deletePopup);
  const [isOrderPopup, setIsOrderPopup] = useRecoilState(orderPopup);
  const setBlind = useSetRecoilState(isBlind);
  /** 메뉴 상세보기 */
  const explainMenu = async () => {
    // 음식에 대한 정보 출력을 위한 rbpi 서버와 통신
    const rpiMenu = {
      menuName: nowMenu.name,
      menuDesc: nowMenu.description,
      menuPrice: nowMenu.price,
    };
    await selectBasket(rpiMenu);
  };
  /**
   * 좌우 화살표 클릭 이벤트
   * nowFood 전환
   * @param isNext 오른쪽 화살표인지 아닌지 가려줄 boolean
   */
  const toggleMenu = (isNext: boolean) => {
    setNowMenu((prev) => {
      const index = basket.findIndex((food) => food.id === prev.id);
      const next = isNext
        ? index === basket.length - 1
          ? basket[0]
          : basket[index + 1]
        : index === 0
        ? basket[basket.length - 1]
        : basket[index - 1];
      // next에 대한 정보(메뉴)를 담아 라즈베리 요청
      const rpiMenu = {
        menuName: next.name,
        menuQty: next.qty,
        orderIdx: basket.findIndex((menu) => menu.id === next.id) + 1,
        orderQty: basket.length,
        eventDir: isNext ? "r" : "l",
      };
      moveBasket(rpiMenu);
      return next;
    });
  };
  /**
   * 상하 화살표 클릭 이벤트
   * nowFood 수량 변화
   * @param isNext 위쪽 화살표인지 아닌지 가려줄 boolean
   */
  const toggleQty = async (isNext: boolean) => {
    if (!isNext && nowMenu.qty === 1) {
      // 메뉴를 삭제하겠냐는 rpi 요청 보내기
      const rpiMenu = {
        menuName: nowMenu.name,
      };
      if (isDeletePopup) {
        await deleteQuestion(rpiMenu);
      } else {
        setIsDeletePopup(true);
      }
      return;
    }
    const newFood: IMenu = {
      id: nowMenu.id,
      name: nowMenu.name,
      description: nowMenu.description,
      categoryId: nowMenu.categoryId,
      imageUrl: nowMenu.imageUrl,
      price: nowMenu.price,
      qty:
        typeof nowMenu.qty == "number"
          ? isNext
            ? nowMenu.qty + 1
            : nowMenu.qty - 1
          : undefined,
    };
    const newBasket: IMenu[] = basket.slice();
    const index = newBasket.findIndex((value) => value.id === newFood.id);
    if (index !== -1) newBasket[index] = newFood;
    setNowMenu(newFood);
    setBasket(newBasket);
    // 장바구니 메뉴 수정
    const rpiMenu = {
      menuName: newFood.name,
      menuQty: newFood.qty,
      eventDir: isNext ? "u" : "d",
    };
    await changeBasket(rpiMenu);
  };
  /** 메뉴 제거하기 */
  const deleteSelectedMenu = async () => {
    setIsDeletePopup(false);
    const newBasket = basket.filter((value) => value.id !== nowMenu.id);
    setBasket(newBasket);
    if (newBasket.length !== 0) {
      setNowMenu(newBasket[0]);
    } else {
      setCustom(STATE_MENU);
    }
    const rpiData = {
      eventRes: 1,
      eventEmptyBasket: basket.length <= 1 ? 1 : 0,
    };
    await deleteResult(rpiData);
  };
  /** 주문 완료하기 */
  const requestOrder = async () => {
    const number = sessionStorage.getItem("tableNumber");
    const tableNumber = parseInt(number ? number : "0");
    const rpiOrders: any[] = [];
    const sprOrders: any[] = [];
    basket.forEach((menu) => {
      const sprOrder = {
        menuId: menu.id,
        quantity: menu.qty,
      };
      const rpiOrder = {
        menuName: menu.name,
        menuQty: menu.qty,
      };
      sprOrders.push(sprOrder);
      rpiOrders.push(rpiOrder);
    });
    const orderPrice = rpiOrders.reduce((prevSum, order) => {
      const price =
        menus.find((menu) => menu.name === order.menuName)?.price || 0;
      return prevSum + price * order.menuQty;
    }, 0);
    await addOrder(tableNumber, sprOrders);
    const rpiData = {
      order: rpiOrders,
      orderPrice: orderPrice,
    };
    await completeOrder(rpiData);
  };
  const toMenu = () => {
    setCustom(STATE_MENU);
  };
  const toOrder = () => {
    setIsOrderPopup(true);
  };
  const toNotBlind = () => {
    setCustom(STATE_MENU);
    setBlind(false);
  };
  const init = async () => {
    const rpiData = {
      menuName: basket[0].name,
      menuQty: basket[0].qty,
      orderIdx: 1,
      orderQty: basket.length,
      menuPrice: basket[0].price,
      orderPrice: basket.reduce((sum, menu) => sum + menu.price, 0),
    };
    await initBasket(rpiData);
    const allMenus = await getMenus();
    const validMenus = allMenus.filter((menu: IMenu) => menu.categoryId !== 1);
    setMenus(validMenus);
    setNowMenu(basket[0]);
  };
  /** 컴포넌트 렌더링 시 한번만 실행 */
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    const handleKeyDown = async (event: any) => {
      setNowKey(event.keyCode);
      const key = event.keyCode;
      if (!isOrderPopup && !isDeletePopup) {
        if (key === 56) {
          // 8 상
          toggleQty(true);
        } else if (key === 50) {
          // 2 하
          toggleQty(false);
        } else if (key === 52) {
          // 4 좌
          toggleMenu(false);
        } else if (key === 54) {
          // 6 우
          toggleMenu(true);
        } else if (key === 53) {
          // 5 선택
          explainMenu();
        } else if (key === 51) {
          setIsOrderPopup(true);
        } else if (key === 49) {
          setCustom(STATE_MENU);
        }
      } else if (isOrderPopup) {
        // 주문 완료 팝업
        if (key === 53) {
          // 5 확인
          setCustom(STATE_ORDER);
          // Spring, Rpi
          await requestOrder();
          setIsOrderPopup(false);
        } else if (key === 49) {
          // 1 이전
          setIsOrderPopup(false);
        }
      } else if (isDeletePopup) {
        // 메뉴 삭제 팝업
        if (key === 53) {
          // 5 확인
          deleteSelectedMenu();
          setIsDeletePopup(false);
        } else if (key === 49) {
          // 1 이전
          setIsDeletePopup(false);
          const rpiData = {
            eventRes: 0,
            eventEmptyBasket: 0,
          };
          await deleteResult(rpiData);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nowKey, toggleQty, toggleMenu]);
  return (
    <Wrapper>
      <Grid>
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleQty(true);
          }}
          $deg="270"
          $gCol="2/3"
          $gRow="1/2"
          $isNext={true}
        />
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleQty(false);
          }}
          $deg="90"
          $gCol="2/3"
          $gRow="3/4"
          $isNext={false}
        />
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleMenu(false);
          }}
          $deg="180"
          $gCol="1/2"
          $gRow="2/3"
          $isNext={false}
        />
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleMenu(true);
          }}
          $deg="0"
          $gCol="3/4"
          $gRow="2/3"
          $isNext={true}
        />
        <Center onClick={explainMenu}>
          <Img $image={nowMenu?.imageUrl} />
        </Center>
      </Grid>
      <SvgContainer>
        <Circle>
          <Svg onClick={toMenu} src={Menu}></Svg>
        </Circle>
        <Circle>
          <Svg onClick={toOrder} src={Notification}></Svg>
        </Circle>
      </SvgContainer>
      <ChangeMode onClick={toNotBlind}>비장애인 모드로{">"}</ChangeMode>
      {isDeletePopup && (
        <>
          <WhiteOverlay />
          <Popup>
            <Info>
              <Svg src={Notification} />
              <PopupMsg>메뉴를 삭제하시겠습니까?</PopupMsg>
            </Info>
            <PopupCircleContainer>
              <PopupCircle>
                <OMark
                  src="https://cdn-icons-png.flaticon.com/512/16/16894.png"
                  onClick={() => {
                    deleteSelectedMenu();
                    setIsDeletePopup(false);
                  }}
                />
              </PopupCircle>
              <PopupCircle>
                <XMark
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828666.png"
                  onClick={() => setIsDeletePopup(false)}
                />
              </PopupCircle>
            </PopupCircleContainer>
          </Popup>
        </>
      )}
      {isOrderPopup && (
        <>
          <WhiteOverlay />
          <Popup>
            <Info>
              <Svg src={Notification} />
              <PopupMsg>주문하시겠습니까?</PopupMsg>
            </Info>
            <PopupCircleContainer>
              <PopupCircle>
                <OMark
                  src="https://cdn-icons-png.flaticon.com/512/16/16894.png"
                  onClick={async () => {
                    setIsOrderPopup(false);
                    await requestOrder();
                    setCustom(STATE_ORDER);
                  }}
                />
              </PopupCircle>
              <PopupCircle>
                <XMark
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828666.png"
                  onClick={() => setIsOrderPopup(false)}
                />
              </PopupCircle>
            </PopupCircleContainer>
          </Popup>
        </>
      )}
    </Wrapper>
  );
}

export default BasketBlind;
