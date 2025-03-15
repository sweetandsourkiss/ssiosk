import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  IMenu,
  STATE_ORDER,
  customState,
  isBlind,
  nowBasket,
  totalMenus,
} from "../../atom";
import { getMenus } from "../../Api/Spring/MenuApis";
import { getCategories } from "../../Api/Spring/CategoryApis";
import { addOrder, getOrders } from "../../Api/Spring/OrderApis";
import { CommonBigModalHeader } from "../../Utils/Common/CommonBigModalHeader";
import { CommonBigModal } from "../../Utils/Common/CommonBigModal";
import { CommonGrid } from "../../Utils/Common/CommonGrid";
import { CommonWhiteOverlay } from "../../Utils/Common/CommonWhiteOverlay";
import { CommonGridElement } from "../../Utils/Common/CommonGridElement";
import { CommonImgLikeDiv } from "../../Utils/Common/CommonImgLikeDiv";
import { CommonScrollDiv } from "../../Utils/Common/CommonScrollDiv";
import { CommonButton } from "../../Utils/Common/CommonButton";
import { CommonContainer } from "../../Utils/Common/CommonContainer";
/** 컨테이너 */
const Wrapper = styled(CommonContainer)`
  width: 100%;
  min-height: 630px;
  height: 100%;
  padding: 2% 0;
  display: flex;
  flex-direction: column;
`;
/** 메인 헤더 */
const MainHeader = styled(CommonContainer)`
  width: 100%;
  min-height: 150px;
  height: 20%;
  padding: 0 3%;
  flex-direction: column;
  justify-content: space-between;
`;
const SmallHeader = styled(CommonBigModalHeader)``;
/** 메인 바디 */
const MainBody = styled(CommonScrollDiv)`
  width: 100%;
  height: 80%;
  padding: 10px;
  gap: 10px;
  display: flex;
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-track {
    width: 0;
  }
`;
const MainBodyContainer = styled(CommonScrollDiv)`
  width: 90%;
  height: 100%;
  background-color: ${(props) => props.theme.bg.yellow};
`;
const MainBodySideContainer = styled(CommonScrollDiv)`
  background-color: ${(props) => props.theme.bg.yellow};
  width: 18%;
  height: 100%;
  padding: 0;
`;
const Tops = styled(CommonContainer)`
  width: 100%;
  justify-content: space-between;
`;
/** 로고 */
const Logo = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  font-size: 44px;
  font-weight: bolder;
  justify-content: start;
  align-items: center;
  color: ${(props) => props.theme.text.greenBlue};
`;
const ReceiptBtn = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.red.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`};
  margin-left: auto;
`;
/** 탭 전체 컴포넌트 */
const Tabs = styled(CommonScrollDiv)`
  display: flex;
  width: 100%;
  height: 50%;
  gap: 20px;
  align-items: center;
  &::-webkit-scrollbar {
    width: 0px;
  }
  &:last-child {
    margin-left: auto;
  }
`;
/** 탭 단일 컴포넌트 */
const Tab = styled(CommonButton)<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 4px 0 0 ${props.theme.btn.red.shadow}`
      : `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    props.$isSelected
      ? `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`
      : `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  font-size: 28px;
  cursor: pointer;
`;
/** 음식 전체 컴포넌트 */
const Menus = styled(CommonGrid)`
  width: 100%;
  align-items: center;
`;

/** 음식 단일 컴포넌트 */
const Menu = styled(CommonGridElement)<{ $isInBasket: boolean }>`
  border: solid 10px
    ${(props) =>
      props.$isInBasket
        ? props.theme.btn.yellow.shadow
        : props.theme.text.greenBlue};
`;
const Image = styled(CommonImgLikeDiv)<{ $menuImage: string | undefined }>`
  background-image: ${(props) =>
    props.$menuImage
      ? `url(${props.$menuImage})`
      : "url(https://cdn-icons-png.flaticon.com/512/10701/10701484.png)"};
`;
const BigImage = styled(CommonImgLikeDiv)<{ $menuImage: string | undefined }>`
  width: 50%;
  background-image: ${(props) =>
    props.$menuImage
      ? `url(${props.$menuImage})`
      : "url(https://cdn-icons-png.flaticon.com/512/10701/10701484.png)"};
`;
const Info = styled.div`
  font-size: 18px;
  font-weight: bolder;
`;
const Name = styled.div<{ $maxLength: number }>`
  font-weight: bold;
  white-space: pre-line;
  word-break: ${(props) => (props.$maxLength > 6 ? "break-all" : "keep-all")};
  text-align: center;
`;
const Receipt = styled(CommonBigModal)`
  position: absolute;
  width: 40vw;
  height: 60vh;
  left: 30vw;
  top: 10vh;
  border-radius: 30px;
  align-items: center;
`;
/** 장바구니 빅 모달 */
const Basket = styled(CommonBigModal)``;
/** 장바구니에 담길 음식 목록 컴포넌트 */
const List = styled(CommonScrollDiv)`
  width: 100%;
  height: 75%;
  font-size: 16px;
  color: black;
  gap: 10px;
  flex-direction: column;
  justify-content: start;
  display: flex;
  padding-top: 2%;
  padding-right: 1%;
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-track {
    width: 0;
  }
`;
/** 음식 컴포넌트 */
const Bucket = styled.div`
  width: 100%;
  display: flex;
  height: fit-content;
  justify-content: space-between;
  align-items: center;
`;
const BucketResult = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  margin-top: auto;
`;
/** 음식 상세보기 컴포넌트 */
const BigFood = styled(CommonScrollDiv)<{ $isInBasket: boolean }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: 10vh;
  left: 0;
  right: 0;
  padding: 2%;
  margin: 0 auto;
  border-radius: 100px;
  overflow: hidden;
  background-color: white;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid 20px
    ${(props) =>
      props.$isInBasket
        ? props.theme.btn.yellow.shadow
        : props.theme.text.greenBlue};
  gap: 30px;
  color: black;
`;
/** 음식 상세보기 설명 컴포넌트 */
const BigOverview = styled.div`
  width: 90%;
  height: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const BigDesc = styled.div`
  width: 90%;
  height: 60%;
  text-align: center;
  font-size: 28px;
  word-break: keep-all;
  font-weight: bold;
  line-height: normal;
`;
const Infos = styled(CommonContainer)`
  display: grid;
  grid-template-columns: 40% 40% 10%;
  justify-content: space-around;
  background-color: white;
  padding: 10px 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 80%;
  color: black;
  margin-right: 10px;
`;
const NamePrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
const Btns = styled.div`
  margin-top: auto;
  display: flex;
  gap: 20px;
`;
const FuntionBtns = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
/** 버튼 */
const FuntionBtn = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  font-size: 2em;
  width: 80%;
  max-width: 20vw;
  font-weight: bolder;
  cursor: pointer;
`;
const BasketBtn = styled(CommonButton)<{ $isBasket: boolean }>`
  box-shadow: ${(props) =>
    props.$isBasket
      ? `0 4px 0 0 ${props.theme.btn.red.shadow}`
      : `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    props.$isBasket
      ? `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`
      : `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  font-size: 2em;
  width: 80%;
  font-weight: bolder;
`;
const BucketBtn = styled(CommonButton)<{ $isClear: boolean }>`
  width: 20%;
  height: fit-content;
  box-shadow: 0 4px 0 0
    ${(props) =>
      props.$isClear
        ? `${props.theme.btn.red.shadow}`
        : `${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    props.$isClear
      ? `linear-gradient(0deg,  ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`
      : `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
`;
const SmallBtn = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  font-size: 20px;
  width: 40px;
  height: 40px;
  font-weight: bolder;
`;
const BucketPrice = styled.div`
  font-size: 24px;
  font-weight: bolder;
`;
const OrderPrice = styled.div`
  font-size: 32px;
  color: black;
  margin-top: auto;
`;
/** 장바구니 끄기 */
const Xbtn = styled.div`
  font-size: 32px;
  cursor: pointer;
`;
const ModalOverlay = styled(CommonWhiteOverlay)``;
const Popup = styled(CommonContainer)`
  position: fixed;
  width: 30vw;
  height: fit-content;
  margin: auto;
  background-color: ${(props) => props.theme.bg.popup};
  border-radius: 10%;
  color: black;
  text-align: center;
  flex-direction: column;
  padding: 3% 0;
`;
const Msg = styled.div`
  margin: auto 0;
  text-align: center;
  font-weight: bolder;
  font-size: 3em;
`;
const PopupBtns = styled.div`
  display: flex;
  width: 90%;
  height: 30%;
  justify-content: center;
  gap: 5%;
`;
const PopupBtn = styled(CommonButton)`
  width: 40%;
  margin-top: 10%;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
`;
interface ICatForm {
  id: number;
  name: string;
}
function OrderNotBlind() {
  const history = useNavigate();
  const bigFoodMatch = useMatch("/custom/:menuName");
  const [menus, setMenus] = useRecoilState(totalMenus);
  const [categories, setCategories] = useState<ICatForm[]>([]);
  const [selectedCat, setSelectedCat] = useState(1);
  const [basket, setBasket] = useRecoilState(nowBasket);
  const [basketOpen, setBasketOpen] = useState(false);
  const [nowKey, setNowKey] = useState(-1);
  const setCustom = useSetRecoilState(customState);
  const setBlind = useSetRecoilState(isBlind);
  const [sum, setSum] = useState(0);
  const [isBasketEmpty, setIsEmptyBasket] = useState(false);
  const [isOrderConfirm, setIsOrderConfirm] = useState(false);
  const [isMainConfirm, setIsMainConfirm] = useState(false);
  const [isMenuDeleteConfirm, setIsMenuDeleteConfirm] = useState(false);
  const [isBasketEmptyConfirm, setIsBasketEmptyConfirm] = useState(false);
  const [deleteFood, setDeleteFood] = useState<any>(null);
  const [tableOrder, setTableOrder] = useState<any[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [tablePrice, setTablePrice] = useState(0);
  const onOverlayClick = () => {
    if (clickedMenu) {
      clickedMenu = "";
      history(-1);
    }
  };
  /**
   * 장바구니 추가, 상세 창 닫기
   * @param clickedFood 클릭한 메뉴
   */
  const addToBasket = (clickedFood: IMenu) => {
    if (basket.find((food) => food.name === clickedFood.name)) {
      alert("장바구니에 이미 존재합니다.");
      return;
    }
    // onOverlayClick();
    const newFood: IMenu = {
      id: clickedFood.id,
      name: clickedFood.name,
      description: clickedFood.description,
      categoryId: clickedFood.categoryId,
      imageUrl: clickedFood.imageUrl,
      price: clickedFood.price,
      qty: 1,
    };
    setBasket((prev) => [...prev, newFood]);
    if (bigFoodMatch) onOverlayClick();
  };
  /**
   * 클릭한 카테고리로 렌더링
   * @param event 클릭 이벤트 감지
   */
  const toggleClick = (id: number) => {
    setSelectedCat(id);
  };
  /** 클릭한 음식 찾기 */
  let clickedMenu: any =
    bigFoodMatch?.params.menuName &&
    menus.find((food) => food.name === bigFoodMatch?.params.menuName);
  /**
   * 메뉴 상세보기
   * @param menuName 상세볼 메뉴명
   */
  const onFoodClicked = (menuName: string) => {
    if (!basketOpen) history(`/custom/${menuName}`);
  };
  /**
   * 수량 변화 이벤트
   * @param clickedFood 클릭한 음식
   * @param isNext 증가 or 감소
   */
  const toggleQty = (clickedFood: IMenu, isNext: boolean) => {
    if (!isNext && clickedFood.qty === 1) {
      setDeleteFood(clickedFood);
      setIsMenuDeleteConfirm(true);
      return;
    }
    const newFood: IMenu = {
      id: clickedFood.id,
      name: clickedFood.name,
      description: clickedFood.description,
      categoryId: clickedFood.categoryId,
      imageUrl: clickedFood.imageUrl,
      price: clickedFood.price,
      qty:
        typeof clickedFood.qty == "number"
          ? isNext
            ? clickedFood.qty + 1
            : clickedFood.qty - 1
          : undefined,
    };
    const newBasket: IMenu[] = basket.slice();
    const index = newBasket.findIndex((value) => value.id === newFood.id);
    if (index !== -1) newBasket[index] = newFood;
    setBasket(newBasket);
    setSum(
      newBasket.reduce(
        (prevSum, menu) => prevSum + menu.price * (menu.qty || 0),
        0,
      ),
    );
  };
  const basketVarients = {
    invisible: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };
  const toggleBasket = () => {
    if (!basketOpen) {
      setSum(
        basket.reduce(
          (prevSum, menu) => prevSum + menu.price * (menu.qty || 0),
          0,
        ),
      );
    }
    setBasketOpen((prev) => !prev);
  };
  /** 주문 요청 보내기 */
  const requestOrder = async () => {
    const number = sessionStorage.getItem("tableNumber");
    const tableNumber = parseInt(number ? number : "0");
    const orders: any[] = [];
    basket.forEach((menu) => {
      const order = {
        menuId: menu.id,
        quantity: menu.qty,
      };
      orders.push(order);
    });
    await addOrder(tableNumber, orders);
    setCustom(STATE_ORDER);
  };
  const init = async () => {
    const allMenus = await getMenus();
    const allCat = await getCategories();
    const validMenus = allMenus.filter((menu: IMenu) => menu.categoryId !== 1);
    if (validMenus.length === 0) {
      alert("메뉴가 없습니다!!!");
      history(-1);
    }
    const validCat = allCat.filter((cat: any) => {
      if (cat.id === 1) return false;
      const valid = validMenus.filter(
        (menu: IMenu) => menu.categoryId === cat.id,
      );
      if (valid.length > 0) {
        return true;
      } else return false;
    });
    setMenus(validMenus);
    setCategories(validCat);
    setSelectedCat(validCat[0].id);
    const tOrder = await getOrders(
      parseInt(sessionStorage.getItem("tableNumber") || "0"),
    );
    if (tOrder) {
      setTableOrder(tOrder);
      let sum = 0;
      tOrder.forEach((order: any) => {
        const food = validMenus.find((menu: any) => menu.id === order.menuId);
        if (food) {
          const price = food.price * order.quantity;
          sum += price;
        }
      });
      setTablePrice(sum);
    }
  };
  useEffect(() => {
    const tableNumber = sessionStorage.getItem("tableNumber");
    if (tableNumber) {
      init();
    } else {
      alert("테이블 번호가 없습니다!!");
      history(-1);
    }
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      setNowKey(event.keyCode);
      const key = event.keyCode;
      if (key >= 48 && key <= 57) {
        setBlind(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nowKey]);
  return (
    <Wrapper>
      <MainHeader>
        <Tops>
          <Logo>SSIOSK</Logo>
        </Tops>
        <Tabs>
          {categories.map((cat) => (
            <Tab
              onClick={() => toggleClick(cat.id)}
              $isSelected={selectedCat === cat.id}
              key={cat.id}
            >
              {cat.name}
            </Tab>
          ))}
          {tableOrder.length && (
            <ReceiptBtn onClick={() => setIsReceiptOpen(true)}>
              주문내역
            </ReceiptBtn>
          )}
        </Tabs>
      </MainHeader>
      <MainBody>
        <MainBodyContainer>
          <Menus>
            {menus.map((menu) => {
              const arr = menu.name.split(" ");
              let maxL = 0;
              arr.forEach((str) => {
                if (maxL < str.length) {
                  maxL = str.length;
                }
              });
              return menu.categoryId === selectedCat ? (
                <Menu
                  layoutId={menu.name}
                  key={menu.name}
                  onClick={() => {
                    onFoodClicked(menu.name);
                  }}
                  $isInBasket={basket.findIndex((v) => v.id === menu.id) !== -1}
                >
                  <Image $menuImage={menu.imageUrl} />
                  <Name $maxLength={maxL}>{menu.name}</Name>
                  <Info>{menu.price.toLocaleString("ko-KR")}원</Info>
                </Menu>
              ) : null;
            })}
          </Menus>
        </MainBodyContainer>
        <MainBodySideContainer>
          <FuntionBtns>
            <FuntionBtn
              onClick={() => {
                setIsMainConfirm(true);
              }}
            >
              초기화면
            </FuntionBtn>
            <BasketBtn $isBasket={basketOpen} onClick={toggleBasket}>
              주문하기
            </BasketBtn>
          </FuntionBtns>
        </MainBodySideContainer>
      </MainBody>
      {basketOpen && (
        <AnimatePresence>
          <ModalOverlay />
          <Basket
            variants={basketVarients}
            initial="invisible"
            animate="visible"
          >
            <SmallHeader>
              <Logo>장바구니</Logo>
              <Xbtn onClick={toggleBasket}>❌</Xbtn>
            </SmallHeader>
            {basket.length ? (
              <List>
                {basket.map((food) => (
                  <Bucket key={food.id}>
                    <Infos>
                      <Info>{food.name}</Info>
                      <Info>
                        {(food.price * (food.qty || 1)).toLocaleString("ko-KR")}
                        원
                      </Info>
                      <Info>{food.qty}개</Info>
                    </Infos>
                    <Btns>
                      <SmallBtn onClick={() => toggleQty(food, true)}>
                        +
                      </SmallBtn>
                      <SmallBtn onClick={() => toggleQty(food, false)}>
                        -
                      </SmallBtn>
                    </Btns>
                  </Bucket>
                ))}
              </List>
            ) : (
              <Msg>🍔 장바구니에 메뉴를 담으세요!!</Msg>
            )}
            <BucketResult>
              {basket.length ? (
                <>
                  <BucketBtn
                    $isClear={true}
                    onClick={() => {
                      setIsBasketEmptyConfirm(true);
                    }}
                  >
                    비우기
                  </BucketBtn>
                  <BucketPrice>
                    총 가격: {sum.toLocaleString("ko-KR")}원
                  </BucketPrice>
                  <BucketBtn
                    $isClear={false}
                    onClick={() => {
                      basket.length === 0
                        ? setIsEmptyBasket(true)
                        : setIsOrderConfirm(true);
                    }}
                  >
                    주문하기
                  </BucketBtn>
                </>
              ) : null}
            </BucketResult>
          </Basket>
        </AnimatePresence>
      )}
      {isReceiptOpen && (
        <Receipt>
          <SmallHeader>
            <Logo>주문 목록</Logo>
            <Xbtn onClick={() => setIsReceiptOpen(false)}>❌</Xbtn>
          </SmallHeader>
          <List>
            {tableOrder.map((order: any) => {
              const food: any = menus.find((menu) => menu.id === order.menuId);
              const price = food.price * order.quantity;
              return (
                <Bucket key={food.id}>
                  <Infos>
                    <Info>{food.name}</Info>
                    <Info>{price.toLocaleString("ko-KR")}원</Info>
                    <Info>{order.quantity}개</Info>
                  </Infos>
                </Bucket>
              );
            })}
          </List>
          <OrderPrice>
            주문금액 : {tablePrice.toLocaleString("ko-KR")} 원
          </OrderPrice>
        </Receipt>
      )}
      {bigFoodMatch && (
        <>
          <ModalOverlay
            onClick={onOverlayClick}
            style={{ backgroundColor: "transparent" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <BigFood
            layoutId={bigFoodMatch.params.menuName}
            exit={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            $isInBasket={
              basket.findIndex((v) => v.id === clickedMenu.id) !== -1
            }
          >
            {clickedMenu && (
              <>
                <BigOverview>
                  <BigImage $menuImage={clickedMenu.imageUrl} />
                  <NamePrice>
                    <Info>{clickedMenu.name}</Info>
                    <Info>{clickedMenu.price} 원</Info>
                  </NamePrice>
                </BigOverview>
                <BigDesc>{clickedMenu.description}</BigDesc>
                <Btns>
                  <FuntionBtn onClick={() => addToBasket(clickedMenu)}>
                    담기
                  </FuntionBtn>
                  <FuntionBtn onClick={onOverlayClick}>취소</FuntionBtn>
                </Btns>
              </>
            )}
          </BigFood>
        </>
      )}
      {isMainConfirm && (
        <>
          <ModalOverlay />
          <Popup>
            <Msg>초기화면으로</Msg>
            <Msg>돌아갈까요?</Msg>
            <PopupBtns>
              <PopupBtn
                onClick={() => {
                  setCustom("");
                  history("/");
                }}
              >
                확인
              </PopupBtn>
              <PopupBtn onClick={() => setIsMainConfirm(false)}>취소</PopupBtn>
            </PopupBtns>
          </Popup>
        </>
      )}
      {isBasketEmpty && (
        <>
          <ModalOverlay />
          <Popup>
            <Msg>장바구니가</Msg>
            <Msg>비어있습니다</Msg>
            <PopupBtn
              onClick={() => {
                setIsEmptyBasket(false);
              }}
            >
              확인
            </PopupBtn>
          </Popup>
        </>
      )}
      {isOrderConfirm && (
        <>
          <ModalOverlay />
          <Popup>
            <Msg>주문</Msg>
            <Msg>하시겠습니까?</Msg>
            <PopupBtns>
              <PopupBtn
                onClick={() => {
                  requestOrder();
                }}
              >
                확인
              </PopupBtn>
              <PopupBtn onClick={() => setIsOrderConfirm(false)}>취소</PopupBtn>
            </PopupBtns>
          </Popup>
        </>
      )}
      {isMenuDeleteConfirm && (
        <>
          <ModalOverlay />
          <Popup>
            <Msg>메뉴를</Msg>
            <Msg>삭제하시겠습니까?</Msg>
            <PopupBtns>
              <PopupBtn
                onClick={() => {
                  const newBasket = basket.filter(
                    (value) => value.id !== deleteFood.id,
                  );
                  setBasket(newBasket);
                  setSum(
                    newBasket.reduce(
                      (prevSum, menu) => prevSum + menu.price * (menu.qty || 0),
                      0,
                    ),
                  );
                  setIsMenuDeleteConfirm(false);
                }}
              >
                확인
              </PopupBtn>
              <PopupBtn onClick={() => setIsMenuDeleteConfirm(false)}>
                취소
              </PopupBtn>
            </PopupBtns>
          </Popup>
        </>
      )}
      {isBasketEmptyConfirm && (
        <>
          <ModalOverlay />
          <Popup>
            <Msg>장바구니를</Msg>
            <Msg>비우시겠습니까?</Msg>
            <PopupBtns>
              <PopupBtn
                onClick={() => {
                  setBasket([]);
                  setIsBasketEmptyConfirm(false);
                  setBasketOpen(false);
                }}
              >
                확인
              </PopupBtn>
              <PopupBtn onClick={() => setIsBasketEmptyConfirm(false)}>
                취소
              </PopupBtn>
            </PopupBtns>
          </Popup>
        </>
      )}
    </Wrapper>
  );
}

export default OrderNotBlind;
