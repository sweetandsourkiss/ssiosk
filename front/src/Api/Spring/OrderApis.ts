import axios from "axios";

const BACK_BASE_URL = "https://i9a201.p.ssafy.io/api/orders";
/**
 * 주문 조회
 * @param tableNumber
 * @param startAt
 * @param endAt
 * @returns
 */
export const getOrders = async (
  tableNumber?: number,
  startAt?: any,
  endAt?: any,
) => {
  try {
    if (tableNumber || startAt || endAt) {
      const res = await axios.get(
        `${BACK_BASE_URL}?tableNumber=${tableNumber}`,
      );
      return res.data;
    } else {
      const res = await axios.get(`${BACK_BASE_URL}`);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * 테이블 별 주문 등록
 * @param tableNumber
 * @param order
 * @returns
 */
export const addOrder = async (tableNumber: number, order: any[]) => {
  try {
    if (tableNumber) {
      const res = await axios.post(
        `https://i9a201.p.ssafy.io/api/${tableNumber}/orders`,
        order,
      );
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * 주문 수정
 * @param order
 * @returns
 */
export const modifyOrder = async (order: any) => {
  try {
    if (order) {
      const qty = {
        quantity: order.quantity,
      };
      const res = await axios.put(`${BACK_BASE_URL}/${order.id}`, qty);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * 주문 삭제
 * @param orderId
 * @returns
 */
export const deleteOrder = async (orderId: number) => {
  try {
    if (orderId) {
      const res = await axios.delete(`${BACK_BASE_URL}/${orderId}`);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const tableExitProcess = async (tableNumber: number) => {
  try {
    if (tableNumber) {
      const res = await axios.put(
        `${BACK_BASE_URL}/table-number/${tableNumber}`,
      );
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
