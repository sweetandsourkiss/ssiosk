import axios from "axios";
/** RPI_BASE_URL */
const RPI_BASE_URL = "https://i9a201.p.ssafy.io/device/basket";
// const RPI_BASE_URL = "https://70.12.246.78:5000/device/basket";
// const RPI_BASE_URL = "http://70.12.246.78:5000/device/basket";
/** 장바구니 초기 접속 */
/** {menuName:string, menuQty:number, orderIdx:number, orderQty:number, menuPrice:number, orderPrice:number} */
export const initBasket = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 장바구니 메뉴 이동 */
/** {menu:string, menuQty:number, orderIdx:number, orderQty:number, eventDir:string} */
/** data.direction = "r" || "l" */
export const moveBasket = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/move`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 장바구니 메뉴 선택 */
/** {menuName:string, menuDesc:string, menuPrice:number} */
export const selectBasket = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/select`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 장바구니 메뉴 수량 수정 */
/** {menuName:string, menuQty:number, direction:string} */
/** data.direction = "u" || "d" */
export const changeBasket = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/change`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 메뉴 삭제 응답 */
export const deleteQuestion = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/delete`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 메뉴 삭제 결과 */
export const deleteResult = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/delete/result`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
// 주문 완료 질문
export const completeOrder = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/complete`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
