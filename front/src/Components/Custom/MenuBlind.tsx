import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import {
  IMenu,
  STATE_BASKET,
  customState,
  isBlind,
  nowBasket,
  selectedCategoryMenus,
  selectedMenu,
  totalMenus,
} from "../../atom";
import Arrow from "../../Svg/Arrow.svg";
import House from "../../Svg/House.svg";
import Cart from "../../Svg/Cart.svg";
import { getMenus } from "../../Api/Spring/MenuApis";
import { getCategories } from "../../Api/Spring/CategoryApis";
import {
  mainQuestion,
  moveMenu,
  selectMenu,
  startMenu,
} from "../../Api/Rpi/BlindMenuApis";
import { useNavigate } from "react-router-dom";
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
const PopupCircleContainer = styled(BlindPopupCircleContainer)``;
const PopupCircle = styled(BlindPopupCircle)``;
const PopupMsg = styled(BlindPopupMsg)``;
const OMark = styled(BlindOSignImg)``;
const XMark = styled(BlindXSignImg)``;
const Grid = styled(BlindGrid)``;
const Center = styled(BlindGridCenter)<{ $choosed: boolean }>`
  border: ${(props) =>
    props.$choosed
      ? `40px solid ${props.theme.btn.yellow.shadow}`
      : "40px solid white"};
`;
const Img = styled(CommonImgLikeDiv)<{ $image: string }>`
  width: 70%;
  min-height: 250px;
  background-image: ${(props) =>
    props.$image
      ? `url(${props.$image})`
      : "url(https://cdn-icons-png.flaticon.com/512/10701/10701484.png)"};
`;
interface ICatForm {
  id: number;
  name: string;
}
/** 상하좌우 화살표에 대한 컴포넌트 */
const MenuArrow = styled(BlineGridArrow)<{
  $deg: string;
  $gCol: string;
  $gRow: string;
  $isNext: boolean;
}>`
  grid-column: ${(props) => props.$gCol}; // 그리드 상 위치 구별
  grid-row: ${(props) => props.$gRow}; // 그리드 상 위치 구별
  transform: ${(props) =>
    "rotate(" + props.$deg + "deg)"}; // 위치에 따른 화살표 각도 변화
`;

function MenuBlind() {
  /** history */
  const history = useNavigate();
  /** Recoil */
  const [menus, setMenus] = useRecoilState(totalMenus);
  const [categories, setCategories] = useState<ICatForm[]>([]);
  const setBlind = useSetRecoilState(isBlind);
  const [nowFood, setNowFood] = useRecoilState(selectedMenu);
  const [nowCat, setNowCat] = useRecoilState(selectedCategoryMenus);
  const [nowKey, setNowKey] = useState(-1);
  const [basket, setBasket] = useRecoilState(nowBasket);
  const [isChoosed, setIsChoosed] = useState(false);
  const [isMainPopup, setIsMainPopup] = useState(false);
  const [isBasketEmpty, setIsBasketEmpty] = useState(false);
  const setCustom = useSetRecoilState(customState);
  /** 장바구니에 담기 */
  const addToBasket = () => {
    if (basket.findIndex((value) => value.id === nowFood.id) > -1) {
      setBasket((prev) => prev.filter((v) => v.id !== nowFood.id));
      setIsChoosed(false);
      // 선택이 해제됨을 알리는 라즈베리 요청
      const rpiData = {
        menuName: nowFood.name,
        eventSel: 0,
      };
      selectMenu(rpiData);
    } else {
      const newFood: IMenu = {
        id: nowFood.id,
        name: nowFood.name,
        description: nowFood.description,
        categoryId: nowFood.categoryId,
        imageUrl: nowFood.imageUrl,
        price: nowFood.price,
        qty: 1,
      };
      setNowFood(newFood);
      setBasket((prev) => [...prev, newFood]);
      setIsChoosed(true);
      // 선택이 활성화됨을 알리는 라즈베리 요청
      const rpiData = {
        menuName: newFood.name,
        eventSel: 1,
      };
      selectMenu(rpiData);
    }
  };
  /**
   * 좌우 화살표 클릭 이벤트
   * @param isNext 오른쪽 화살표인지 아닌지 가려줄 boolean
   */
  const toggleMenu = (isNext: boolean) => {
    setNowFood((prev) => {
      const index = nowCat.findIndex((food) => food.id === prev.id);
      const next = isNext
        ? index === nowCat.length - 1
          ? nowCat[0]
          : nowCat[index + 1]
        : index === 0
        ? nowCat[nowCat.length - 1]
        : nowCat[index - 1];
      toggleSelected(next);
      // next에 대한 정보(메뉴)를 담아 라즈베리 요청
      const rpiMenu = {
        menuName: next.name,
        menuIdx: nowCat.findIndex((cat) => cat.id === next.categoryId) + 1,
        categoryQty: nowCat.length,
        menuPrice: next.price,
        eventDir: isNext ? "r" : "l",
      };
      moveMenu(rpiMenu);
      return next;
    });
  };
  /**
   * 상하 화살표 클릭 이벤트
   * @param isNext 위쪽 화살표인지 아닌지 가려줄 boolean
   */
  const toggleCat = (isNext: boolean) => {
    const catId = nowCat[0].categoryId;
    const catIndex = categories.findIndex((cat) => cat.id === catId);
    const next = isNext
      ? // 다음 카테고리
        catIndex === categories.length - 1
        ? menus.filter((food) => food.categoryId === categories[0].id)
        : menus.filter(
            (food) => food.categoryId === categories[catIndex + 1].id,
          )
      : // 이전 카테고리
      catId === categories[0].id
      ? menus.filter(
          (food) => food.categoryId === categories[categories.length - 1].id,
        )
      : menus.filter((food) => food.categoryId === categories[catIndex - 1].id);
    setNowCat(next);
    setNowFood(next[0]);
    toggleSelected(next[0]);
    // next에 대한 정보(카테고리, 메뉴)를 담아 라즈베리 요청
    const nextCatName = categories.find(
      (cat) => cat.id === next[0].categoryId,
    )?.name;
    const rpiMenu = {
      menuName: next[0].name,
      menuIdx: 1, //
      categoryName: nextCatName,
      categoryQty: next.length,
      menuPrice: next[0].price,
      eventDir: isNext ? "u" : "d",
    };
    moveMenu(rpiMenu);
  };
  /** 장바구니에 있는 메뉴인지 확인 */
  const toggleSelected = (menu: IMenu) => {
    basket.findIndex((v) => v.id === menu.id) === -1
      ? setIsChoosed(false)
      : setIsChoosed(true);
  };
  const toNotBlind = () => {
    setBlind(false);
  };
  const toMain = () => {
    setIsMainPopup(true);
  };
  const toBasket = () => {
    if (basket.length === 0) {
      setIsBasketEmpty(true);
    } else {
      setCustom(STATE_BASKET);
    }
  };
  /** 실행 */
  const init = async () => {
    try {
      const allMenus = await getMenus();
      const allCat = await getCategories();
      const validMenus = allMenus.filter(
        (menu: IMenu) => menu.categoryId !== 1,
      );
      const validCat = allCat.filter((cat: any) => {
        if (cat.id === 1) return false;
        const valid = validMenus.filter(
          (menu: IMenu) => menu.categoryId === cat.id,
        );
        if (valid.length > 0) {
          return true;
        } else return false;
      });
      const initMenu = validMenus[0];
      const initCategory = validMenus.filter(
        (menu: any) => menu.categoryId === initMenu.categoryId,
      );
      setMenus(validMenus);
      setCategories(validCat);
      setNowFood(initMenu);
      toggleSelected(initMenu);
      setNowCat(initCategory);
      // 라즈베리 요청
      const rpiMenu = {
        menuName: initMenu.name,
        menuIdx: initMenu.id,
        categoryName: allCat.slice(1)[0].name,
        categoryQty: initCategory.length,
        menuPrice: initMenu.price,
      };
      await startMenu(rpiMenu);
    } catch (error) {}
  };
  /** 컴포넌트 렌더링 시 한번만 실행 */
  useEffect(() => {
    init();
  }, []);
  /** 키(조이스틱) 입력 인지하기 */
  useEffect(() => {
    const handleKeyDown = async (event: any) => {
      setNowKey(event.keyCode);
      const key = event.keyCode;
      if (!isMainPopup) {
        if (key === 56) {
          // 8 상
          toggleCat(true);
        } else if (key === 50) {
          // 2 하
          toggleCat(false);
        } else if (key === 52) {
          // 4 좌
          toggleMenu(false);
        } else if (key === 54) {
          // 6 우
          toggleMenu(true);
        } else if (key === 53) {
          // 5 선택
          addToBasket();
        } else if (key === 51) {
          // 다음
          if (basket.length) {
            setCustom(STATE_BASKET);
          } else {
            alert("장바구니가 비어있습니다.");
          }
        } else if (key === 49) {
          // 1 이전
          setIsMainPopup(true);
          await mainQuestion();
        }
      } else if (isMainPopup) {
        // 메인 팝업
        if (key === 53) {
          // 5 확인
          history("/");
          setIsMainPopup(false);
        } else if (key === 49) {
          // 1 이전
          setIsMainPopup(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nowKey, toggleMenu]);
  return (
    <Wrapper>
      <Grid>
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleCat(true);
          }}
          $deg="270"
          $gCol="2/3"
          $gRow="1/2"
          $isNext={true}
        />
        <MenuArrow
          src={Arrow}
          onClick={() => {
            toggleCat(false);
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
        <Center onClick={addToBasket} $choosed={isChoosed}>
          <Img $image={nowFood?.imageUrl} />
        </Center>
      </Grid>
      <SvgContainer>
        <Circle>
          <Svg onClick={toMain} src={House}></Svg>
        </Circle>
        <Circle>
          <Svg onClick={toBasket} src={Cart}></Svg>
        </Circle>
      </SvgContainer>
      <ChangeMode onClick={toNotBlind}>비장애인 모드로{">"}</ChangeMode>
      {isMainPopup && (
        <>
          <WhiteOverlay />
          <Popup>
            <Info>
              <Svg src={House} />
              <PopupMsg>
                초기화면으로
                <br /> 돌아갈까요?
              </PopupMsg>
            </Info>
            <PopupCircleContainer>
              <PopupCircle>
                <OMark
                  src="https://cdn-icons-png.flaticon.com/512/16/16894.png"
                  onClick={() => {
                    setCustom("");
                    history("/");
                  }}
                />
              </PopupCircle>
              <PopupCircle>
                <XMark
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828666.png"
                  onClick={() => setIsMainPopup(false)}
                />
              </PopupCircle>
            </PopupCircleContainer>
          </Popup>
        </>
      )}
      {isBasketEmpty && (
        <>
          <WhiteOverlay />
          <Popup>
            <Info>
              <Svg src={Cart} />
              <PopupMsg>
                장바구니가
                <br /> 비어있습니다
              </PopupMsg>
            </Info>
            <PopupCircleContainer>
              <PopupCircle>
                <OMark
                  src="https://cdn-icons-png.flaticon.com/512/16/16894.png"
                  onClick={() => {
                    setIsBasketEmpty(false);
                  }}
                />
              </PopupCircle>
            </PopupCircleContainer>
          </Popup>
        </>
      )}
    </Wrapper>
  );
}
export default MenuBlind;
