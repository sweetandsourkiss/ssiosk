import { atom } from "recoil";
export const STATE_MENU = "메뉴";
export const STATE_BASKET = "장바구니";
export const STATE_ORDER = "주문완료";
/** 메뉴 인터페이스 */
export interface IMenu {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  price: number;
  qty?: number;
}
/** (사용자) 현재 장애인 모드인지 판단 */
export const isBlind = atom<boolean>({
  key: "isBlind",
  default: false,
});
/** (관리자) 현재 로그인 상태인지 판단 */
export const isLogin = atom<boolean>({
  key: "isLogin",
  default: false,
});
/** 현재 표시되는 Custom 컴포넌트 */
export const customState = atom<string>({
  key: "customState",
  default: "",
});
/** 현재 표시되는 Admin 컴포넌트 */
export const adminState = atom<string>({
  key: "adminState",
  default: "로그인",
});
/** 전체 메뉴를 불러온 뒤 저장할 state */
export const totalMenus = atom<IMenu[]>({
  key: "totalMenus",
  default: [],
});
/** (장애인 모드) 현재 표시되는 메뉴 */
export const selectedMenu = atom<IMenu>({
  key: "selectedMenu",
  default: {
    id: 0,
    name: "",
    description: "",
    categoryId: 0,
    imageUrl: "",
    price: 0,
    qty: 0,
  },
});
/** (장애인 모드) 현재 장바구니에 담긴 메뉴 */
export const nowBasket = atom<IMenu[]>({
  key: "nowBasket",
  default: [],
});
/** (장애인 모드) 카테고리에 해당하는 메뉴 */
export const selectedCategoryMenus = atom<IMenu[]>({
  key: "selectedCategoryMenus",
  default: [],
});
/** 주문 팝업 상태 */
export const orderPopup = atom<boolean>({
  key: "orderPopup",
  default: false,
});
/** 메뉴 삭제 팝업 상태 */
export const deletePopup = atom<boolean>({
  key: "deletePopup",
  default: false,
});
