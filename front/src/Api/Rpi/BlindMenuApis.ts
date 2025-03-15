import axios from "axios";

const RPI_BASE_URL = "https://i9a201.p.ssafy.io/device/menulist";
// const RPI_BASE_URL = "https://70.12.246.78:5000/device/menulist";
// const RPI_BASE_URL = "http://70.12.246.78:5000/device/menulist";
/** 메뉴판 처음 접속 */
/** {menuName:string, menuIdx:number, categoryName:string, categoryQty:number, menuPrice:number} */
export const startMenu = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 메뉴 이동 */
/** {menu:string, menuNum:number, category:string, categoryVolume:number, price:number, direction:string} */
/** data.direction = "r" || "l" */
export const moveMenu = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/move`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 카테고리 이동 */
/** {menu:string, menuNum:number, category:string, categoryVolume:number, price:number, direction:string} */
/** data.direction = "u" || "d" */
export const moveCategory = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/category`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
/** 메뉴 선택 */
/** {menu:string, selected:number} selected = 0 || 1 */
export const selectMenu = async (data: any) => {
  try {
    if (data) {
      const res = await axios.post(`${RPI_BASE_URL}/select`, data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const mainQuestion = async () => {
  try {
    const res = await axios.get(`${RPI_BASE_URL}/past`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
