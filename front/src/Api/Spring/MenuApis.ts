import axios from "axios";

const BACK_BASE_URL = "https://i9a201.p.ssafy.io/api/menus";
/** 메뉴 조회
 *  menuId가 존재할 경우 일치하는 메뉴 조회
 *  categoryId를 쿼리 파라미터로 작성하는 경우 해당 카테고리의 메뉴만 반환
 */
export const getMenus = async (menuId?: number, categoryId?: number) => {
  try {
    if (menuId || categoryId) {
      if (menuId && categoryId) {
        const res = await axios.get(
          `${BACK_BASE_URL}/${menuId}?categoryId=${categoryId}`,
        );
        return res.data;
      } else if (menuId) {
        const res = await axios.get(`${BACK_BASE_URL}/${menuId}`);
        return res.data;
      } else if (categoryId) {
        const res = await axios.get(
          `${BACK_BASE_URL}?categoryId=${categoryId}`,
        );
        return res.data;
      }
    } else {
      const res = await axios.get(BACK_BASE_URL);
      return res.data;
    }
  } catch (error: any) {
    console.log(error);
    // error.response.data.forEach((e: any) => {
    //   alert(e.message);
    // });
    return false;
  }
};
/**
 * 메뉴 등록
 * 새로운 메뉴를 등록
 */
export const addMenu = async (menu: any) => {
  try {
    if (menu) {
      const file = new FormData();
      file.append("name", menu.name);
      file.append("description", menu.description);
      file.append("categoryId", menu.categoryId);
      if (menu.image) file.append("image", menu.image);
      file.append("price", menu.price);
      const res = await axios({
        method: "post",
        url: `${BACK_BASE_URL}`,
        data: file,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
  } catch (error: any) {
    console.log(error);
    // error.response.data.forEach((e: any) => {
    //   alert(e.message);
    // });
    return false;
  }
};
/**
 * 메뉴 수정
 * menuId와 일치하는 메뉴를 수정
 */
export const modifyMenu = async (menu: any) => {
  try {
    if (menu.id) {
      const file = new FormData();
      file.append("name", menu.name);
      file.append("description", menu.description);
      file.append("categoryId", menu.categoryId);
      if (menu.image) file.append("image", menu.image);
      file.append("price", menu.price);
      const res = await axios({
        method: "put",
        url: `${BACK_BASE_URL}/${menu.id}`,
        data: file,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
  } catch (error: any) {
    console.log(error);
    console.log(error.response);
    // error.response.data.forEach((e: any) => {
    //   alert(e.message);
    // });
    return false;
  }
};
/**
 * 메뉴 삭제
 * menuId와 일치하는 메뉴를 삭제
 */
export const deleteMenu = async (menuId: number) => {
  try {
    if (menuId) {
      const res = await axios.delete(`${BACK_BASE_URL}/${menuId}`);
      return res;
    }
  } catch (error: any) {
    console.log(error);
    // error.response.data.forEach((e: any) => {
    //   alert(e.message);
    // });
    return false;
  }
};
