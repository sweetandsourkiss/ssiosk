import axios from "axios";

const BACK_BASE_URL = "https://i9a201.p.ssafy.io/api/categories";

/**
 * 카테고리 조회
 * @returns
 */
export const getCategories = async () => {
  try {
    const res = await axios.get(`${BACK_BASE_URL}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * 카테고리 등록
 * @param category
 * @returns
 */
export const addCategory = async (category: any) => {
  try {
    if (category) {
      const res = await axios.post(`${BACK_BASE_URL}`, category);
      return res.data;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * 카테고리 수정
 * @param category
 * @returns
 */
export const modifyCategory = async (category: any) => {
  try {
    if (category) {
      const categoryId = category.id;
      delete category.id;
      const res = await axios.put(`${BACK_BASE_URL}/${categoryId}`, category);
      return res.data;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * 카테고리 삭제
 * @param category
 * @returns
 */
export const deleteCategory = async (id: any) => {
  try {
    if (id) {
      const res = await axios.delete(`${BACK_BASE_URL}/${id}`);
      return res;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
