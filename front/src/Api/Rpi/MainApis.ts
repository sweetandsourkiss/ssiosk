import axios from "axios";

const RPI_BASE_URL = "https://i9a201.p.ssafy.io/device";
// const RPI_BASE_URL = "https://70.12.246.78:5000/device";
// const RPI_BASE_URL = "http://70.12.246.78:5000/device";
/** 초기화면 */
export const initDevice = async () => {
  try {
    const res = await axios.get(`${RPI_BASE_URL}/init`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
/** 주문 완료 요청 */
/** {order : [{menuName:string, menuQty:number}, {menuName:string, menuQty:number}], orderPrice:number} */
export const completeOrder = async (data: any) => {
  try {
    const res = await axios.post(`${RPI_BASE_URL}/complete`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
/** 주문 완료 결과 */
/** {eventRes:number} eventRes = 0 || 1 */
export const resultOrder = async (data: any) => {
  try {
    const res = await axios.post(`${RPI_BASE_URL}/complete/result`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
