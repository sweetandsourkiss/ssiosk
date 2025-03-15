import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  addMenu,
  deleteMenu,
  getMenus,
  modifyMenu,
} from "../../Api/Spring/MenuApis";
import { IMenu, totalMenus } from "../../atom";
import { useRecoilState } from "recoil";
import {
  addCategory,
  deleteCategory,
  getCategories,
  modifyCategory,
} from "../../Api/Spring/CategoryApis";
import { CommonGrid } from "../../Utils/Common/CommonGrid";
import { CommonGridElement } from "../../Utils/Common/CommonGridElement";
import { CommonImgLikeDiv } from "../../Utils/Common/CommonImgLikeDiv";
import { CommonScrollDiv } from "../../Utils/Common/CommonScrollDiv";
import { CommonButton } from "../../Utils/Common/CommonButton";
import { CommonContainer } from "../../Utils/Common/CommonContainer";
const Wrapper = styled(CommonContainer)``;
const Categories = styled(CommonContainer)`
  position: fixed;
  top: 16.5vh;
  left: 82vw;
  width: 18vw;
  height: 81.5vh;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  overflow-y: scroll;
  padding: 1% 0;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;
const Category = styled(CommonButton)<{ $selected: boolean }>`
  box-shadow: ${(props) =>
    props.$selected
      ? `0 4px 0 0 ${props.theme.btn.red.shadow}`
      : `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    props.$selected
      ? `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`
      : `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  &:hover {
    background-color: ${(props) => (props.$selected ? "#7158e2" : "black")};
  }
  cursor: pointer;
`;
const Menus = styled(CommonGrid)``;
const Menu = styled(CommonGridElement)`
  border: solid 10px ${(props) => props.theme.text.greenBlue};
  flex-direction: column;
`;
const Image = styled(CommonImgLikeDiv)<{ $menuImage: string | undefined }>`
  width: 50%;
  aspect-ratio: 1/1;
  background-image: ${(props) =>
    props.$menuImage
      ? `url(${props.$menuImage})`
      : "url(https://cdn-icons-png.flaticon.com/512/10701/10701484.png)"};
`;
const InputForm = styled.div`
  width: 95%;
  height: 50px;
  background-color: ${(props) => props.theme.bg.yellow};
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 0 15px;
  color: black;
`;
const SmallInputForm = styled.div`
  width: 90%;
  background-color: ${(props) => props.theme.bg.yellow};
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 0 15px;
  color: black;
  justify-content: space-between;
`;
const Label = styled.div`
  width: 20%;
`;
const Name = styled.div<{ $maxLength: number }>`
  font-weight: bold;
  white-space: pre-line;
  word-break: ${(props) => (props.$maxLength > 6 ? "break-all" : "keep-all")};
  text-align: center;
`;
const Price = styled.div`
  font-weight: bold;
  text-align: center;
`;
const Btns = styled.div`
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;
const FormBtn = styled(CommonButton)`
  min-width: 155px;
  min-height: 60px;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  margin: 10px;
`;
const EditDiv = styled.div`
  width: fit-content;
  height: fit-content;
  min-width: 155px;
  min-height: 60px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  border-width: 0;
  color: white;
  font-family: "SBAggroB";
  font-weight: bolder;
  font-size: 28px;
  cursor: pointer;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  margin: 10px;
`;
const SmallFormBtn = styled(CommonButton)`
  width: 20%;
  height: 100%;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.red.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`};
`;
const Functions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
/** 카테고리 설정, 메뉴 추가 */
const FunctionBtn = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.yellow.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.yellow.start}, ${props.theme.btn.yellow.end})`};
`;
/** 메뉴 상세보기 시 오버레이 컴포넌트 */
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
/** 메뉴 수정 컴포넌트 */
const BigForm = styled(motion.form)`
  position: absolute;
  width: 40%;
  min-width: 400px;
  height: 80%;
  min-height: 600px;
  top: 10%;
  left: 0;
  right: 0;
  padding: 2% 3%;
  margin: 0 auto;
  border-radius: 40px;
  background-color: white;
  color: black;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid 20px ${(props) => props.theme.text.greenBlue};
  gap: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
const BigCategory = styled(CommonScrollDiv)`
  position: absolute;
  width: 50%;
  height: 80%;
  top: 10%;
  left: 0;
  right: 0;
  padding: 2% 3%;
  margin: 0 auto;
  border-radius: 40px;
  background-color: white;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: solid 20px ${(props) => props.theme.btn.yellow.shadow};
  gap: 10px;
`;
const SmallForm = styled.form`
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  color: black;
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  background-color: ${(props) => props.theme.bg.yellow};
  color: black;
  border: none;
  width: 60%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  &::placeholder {
    text-align: start;
    color: black;
  }
  &:focus,
  &:active {
    outline: none;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Select = styled.select`
  width: 50%;
`;
/** 음식 상세보기 제목 컴포넌트 */
const BigName = styled.h3`
  padding: 5px 10px;
  font-size: 24px;
  position: relative;
  color: black;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.bg.pink};
`;
interface IMenuForm {
  name: string;
  description: string;
  price: string;
  categoryId: number;
  image: FileList;
}
interface ICatForm {
  id: number;
  name: string;
}
interface IEditCatForm {
  prevName: number;
  name: string;
}
/** 더미데이터 */
function Manage() {
  const [menus, setMenus] = useRecoilState(totalMenus);
  const [categories, setCategories] = useState<ICatForm[]>([]);
  const [isSelected, setIsSelected] = useState(0);
  const [isAddMenu, setIsAddMenu] = useState(false);
  const [isCat, setIsCat] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [selectedCategoryMenu, setSelectedCategoryMenu] = useState<IMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const [inputMenu, setInputMenu] = useState<IMenu | null>(null);
  const {
    register: menuReg,
    handleSubmit: menuSub,
    watch: menuWatch,
    formState: { errors: menuErrors },
    setValue: menuValue,
  } = useForm<IMenuForm>();

  const {
    register: addMenuReg,
    handleSubmit: addMenuSub,
    formState: { errors: addMenuErrors },
    setValue: addMenuValue,
  } = useForm<IMenuForm>();

  const {
    register: addCatReg,
    handleSubmit: addCatSub,
    formState: { errors: addCatErrors },
    setValue: addCatValue,
  } = useForm<ICatForm>();
  const {
    register: editCatReg,
    handleSubmit: editCatSub,
    formState: { errors: editCatErrors },
    setValue: editCatValue,
  } = useForm<IEditCatForm>();
  const {
    register: removeCatReg,
    handleSubmit: removeCatSub,
    setValue: removeCatValue,
  } = useForm<ICatForm>();
  const toggleSelected = (categoryId: number) => {
    if (isSelected !== categoryId) setIsSelected(categoryId);
    const newMenus = menus.filter((menu) => menu.categoryId === categoryId);
    setSelectedCategoryMenu(newMenus);
  };
  const history = useNavigate();
  const bigMenuMatch = useMatch("/admin/manage/:menuId");
  const onOverlayClick = () => {
    if (selectedMenu) {
      history(-1);
      setSelectedMenu(null);
    }
    if (isAddMenu) setIsAddMenu(false);
    if (isCat) setIsCat(false);
    if (inputDisabled) setInputDisabled(false);
  };
  const onMenuClick = (menuId: number) => {
    history(`/admin/manage/${menuId}`);
    const newMenu =
      selectedCategoryMenu.find((menu) => menu.id === menuId) || null;
    setSelectedMenu(newMenu);
    menuValue("name", newMenu?.name || "");
    menuValue("description", newMenu?.description || "");
    menuValue("price", String(newMenu?.price) || "");
    menuValue("categoryId", newMenu?.categoryId || 1);
  };
  const openAddMenuModal = () => {
    addMenuValue("name", "");
    addMenuValue("description", "");
    addMenuValue("price", "");
    setImagePreview("");
    setIsAddMenu(true);
  };
  const openCatModal = () => {
    addCatValue("name", "");
    editCatValue("name", "");
    setIsCat(true);
  };
  /** 메뉴 추가 */
  const handleAddMenu = async (data: any) => {
    data.categoryId = parseInt(data.categoryId);
    data.price = parseInt(data.price);
    const newMenu = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      image: data.image[0] || null,
    };
    const result = await addMenu(newMenu);
    if (result) {
      alert("메뉴 추가에 성공했습니다.");
      setIsAddMenu(false);
      init();
    }
  };
  /** 메뉴 수정 */
  const handleEditMenu = (data: any) => {
    data.id = selectedMenu?.id;
    data.categoryId = parseInt(data.categoryId);
    data.price = parseInt(data.price);
    if (data.image) {
      data.image = data.image[0];
    }
    if (inputDisabled && window.confirm("수정하시겠습니까?")) {
      menus.forEach(async (menu) => {
        if (menu.id === data.id) {
          history(-1);
          const result = await modifyMenu(data);
          if (result) {
            alert("메뉴 수정이 완료되었습니다.");
            setInputDisabled(false);
            setSelectedMenu(null);
            init();
          }
          menuValue("name", "");
          menuValue("description", "");
          menuValue("price", "");
          menuValue("categoryId", 1);
          // window.location.reload();
        }
      });
    }
  };
  /** 메뉴 삭제 */
  const removeMenu = async (menuId: number) => {
    if (window.confirm("정말로 메뉴를 삭제하시겠습니까?")) {
      if (menuId === -1) {
        alert("메뉴 삭제를 실패했습니다");
        return;
      }
      const result = await deleteMenu(menuId);
      if (result) {
        alert("메뉴 삭제가 완료되었습니다.");
        history(-1);
        init();
      } else {
        alert("메뉴 삭제를 실패했습니다.");
      }
    }
  };
  /** 카테고리 추가 */
  const handleAddCat = async (data: any) => {
    if (window.confirm("카테고리를 추가하시겠습니까?")) {
      const result = await addCategory(data);
      if (result) {
        setIsCat(false);
        init();
      } else {
        alert("카테고리 추가를 실패했습니다.");
      }
    }
  };
  /** 카테고리 수정 */
  const handleEditCat = (data: any) => {
    if (window.confirm("카테고리를 수정하시겠습니까?")) {
      categories?.forEach(async (cat) => {
        if (cat === categories[data.prevName]) {
          delete data.prevName;
          data.id = cat.id;
          const result = await modifyCategory(data);
          if (result) {
            setIsCat(false);
            init();
          } else {
            alert("카테고리 수정을 실패했습니다.");
          }
        }
      });
    }
  };
  /** 카테고리 삭제 */
  const handleRemoveCat = async (data: any) => {
    if (data.name === "1") return;
    if (window.confirm("카테고리를 삭제하시겠습니까?")) {
      const cat = categories?.find((cat) => cat.name === data.name);
      const result = await deleteCategory(cat?.id);
      if (result) {
        setIsCat(false);
        init();
      } else {
        alert("카테고리 삭제가 불가합니다.");
      }
    }
  };
  /** 업로드 이미지 프리뷰 */
  const [imagePreview, setImagePreview] = useState("");
  const preview = menuWatch("image");
  useEffect(() => {
    if (preview && preview.length > 0) {
      const file = preview[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [preview]);
  /** 데이터 불러오기 */
  const init = async () => {
    try {
      const allMenus = await getMenus();
      setMenus(allMenus);
      const allCat = await getCategories();
      if (bigMenuMatch) {
        const initId = bigMenuMatch.params.menuId;
        const initCatId = allMenus.find(
          (menu: any) => String(menu.id) === initId,
        )?.categoryId;
        setSelectedCategoryMenu(
          allMenus.filter((menu: any) => menu.categoryId === initCatId),
        );
        setIsSelected(initCatId);
      } else {
        setSelectedCategoryMenu(
          allMenus.filter((menu: any) => menu.categoryId === 1),
        );
        setIsSelected(1);
      }
      setCategories(allCat);
      // console.log(allMenus);
      // console.log(allCat);
    } catch (error) {}
  };
  useEffect(() => {
    setInputMenu(selectedMenu);
  }, [selectedMenu]);
  useEffect(() => {
    init();
    setIsSelected(1);
    /** 클릭한 메뉴 찾기 */
    setSelectedMenu((__) => {
      const newMenu =
        bigMenuMatch?.params.menuId &&
        selectedCategoryMenu.find(
          (menu) => String(menu.id) === bigMenuMatch?.params.menuId,
        );
      return newMenu || null;
    });
  }, []);
  return (
    <Wrapper>
      <Categories>
        <Functions>
          <FunctionBtn onClick={openCatModal}>카테고리 설정</FunctionBtn>
          <FunctionBtn onClick={openAddMenuModal}>메뉴 추가</FunctionBtn>
        </Functions>
        <hr />
        {categories?.map((cat, index) => (
          <Category
            $selected={isSelected === cat.id}
            onClick={() => toggleSelected(cat.id)}
            key={index}
          >
            {cat.name}
          </Category>
        ))}
      </Categories>
      <Menus>
        {selectedCategoryMenu.map((menu) => {
          const arr = menu.name.split(" ");
          let maxL = 0;
          arr.forEach((str) => {
            if (maxL < str.length) {
              maxL = str.length;
            }
          });
          return (
            <Menu
              layoutId={menu.id + ""}
              key={menu.id}
              onClick={() => {
                onMenuClick(menu.id);
              }}
            >
              <Image $menuImage={menu.imageUrl && menu.imageUrl} />
              <Name $maxLength={maxL}>{menu.name}</Name>
              <Price>{menu.price.toLocaleString("ko-KR")}원</Price>
            </Menu>
          );
        })}
      </Menus>
      <AnimatePresence>
        {bigMenuMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            ></Overlay>
            <BigForm
              layoutId={bigMenuMatch.params.menuId}
              exit={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              onSubmit={menuSub(handleEditMenu)}
              encType="multipart/form-data"
            >
              {selectedMenu && (
                <>
                  <Image $menuImage={inputMenu?.imageUrl} />
                  <InputForm>
                    <Label>이름: </Label>
                    <Input
                      {...menuReg("name", {
                        required: "메뉴명을 입력하세요.",
                        pattern: {
                          value: /^[가-힣0-9\s]*$/,
                          message:
                            "메뉴명은 한글과 공백, 숫자(0-9)만 가능합니다.",
                        },
                        maxLength: {
                          value: 25,
                          message: "메뉴명은 25자 이내로만 가능합니다.",
                        },
                      })}
                      disabled={!inputDisabled}
                      defaultValue={inputMenu?.name}
                    />
                  </InputForm>
                  <div>{menuErrors.name?.message}</div>
                  <InputForm>
                    <Label>설명: </Label>
                    <Input
                      {...menuReg("description", {
                        required: "설명을 입력하세요.",
                        pattern: {
                          value: /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9.,?!\s]*$/,
                          message:
                            "메뉴 설명은 한글과 공백, 숫자, '.'',''?''!'만 가능합니다.",
                        },
                      })}
                      disabled={!inputDisabled}
                      defaultValue={inputMenu?.description}
                    />
                  </InputForm>
                  <div>{menuErrors.description?.message}</div>
                  <InputForm>
                    <Label>가격: </Label>
                    <Input
                      {...menuReg("price", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "숫자만 입력하세요.",
                        },
                        max: {
                          value: 1000000000,
                          message: "10억 이하의 숫자를 입력하세요.",
                        },
                        min: {
                          value: 0,
                          message: "0 이상의 숫자를 입력하세요.",
                        },
                      })}
                      type="number"
                      disabled={!inputDisabled}
                      defaultValue={inputMenu?.price}
                    />
                  </InputForm>
                  <div>{menuErrors.price?.message}</div>
                  <InputForm>
                    <Label>카테고리: </Label>
                    <Select
                      disabled={!inputDisabled}
                      defaultValue={inputMenu?.categoryId}
                      {...menuReg("categoryId", {
                        required: "카테고리를 고르세요.",
                      })}
                    >
                      <option value={1} disabled hidden>
                        카테고리 없음
                      </option>
                      {categories?.slice(1).map((cat, index) => (
                        <option key={index} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </InputForm>
                  <div>{menuErrors.categoryId?.message}</div>
                  <InputForm>
                    <Label>이미지: </Label>
                    <Input
                      disabled={!inputDisabled}
                      {...menuReg("image")}
                      type="file"
                      accept="image/*"
                    />
                  </InputForm>
                  <Btns>
                    <FormBtn hidden={!inputDisabled}>수정</FormBtn>
                    <EditDiv
                      onClick={() => {
                        setInputDisabled(true);
                      }}
                      hidden={inputDisabled}
                    >
                      수정하기
                    </EditDiv>
                    <FormBtn
                      onClick={() => removeMenu(inputMenu?.id || -1)}
                      hidden={inputDisabled}
                    >
                      삭제하기
                    </FormBtn>
                  </Btns>
                </>
              )}
            </BigForm>
          </>
        )}
        {isAddMenu && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            ></Overlay>
            <BigForm
              encType="multipart/form-data"
              onSubmit={addMenuSub(handleAddMenu)}
            >
              <Image $menuImage={imagePreview} />
              <InputForm>
                <Label>이름 :</Label>
                <Input
                  {...addMenuReg("name", {
                    required: "메뉴명을 입력하세요.",
                    pattern: {
                      value: /^[가-힣0-9\s]*$/,
                      message: "메뉴명은 한글만 가능합니다.",
                    },
                    maxLength: {
                      value: 25,
                      message: "메뉴명은 25자 이내로만 가능합니다.",
                    },
                  })}
                  type="text"
                />
              </InputForm>
              <div>{addMenuErrors.name?.message}</div>
              <InputForm>
                <Label>설명 :</Label>
                <Input
                  {...addMenuReg("description", {
                    required: "설명을 입력하세요.",
                    pattern: {
                      value: /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9.,?!\s]*$/,
                      message:
                        "메뉴 설명은 한글과 숫자 '.' ',' '?' '!'만 가능합니다.",
                    },
                  })}
                  type="text"
                />
              </InputForm>
              <div>{addMenuErrors.description?.message}</div>
              <InputForm>
                <Label>가격 :</Label>
                <Input
                  {...addMenuReg("price", {
                    required: "가격을 입력하세요.",
                    max: {
                      value: 1000000000,
                      message: "10억 이하의 숫자를 입력하세요.",
                    },
                    min: {
                      value: 0,
                      message: "0 이상의 숫자를 입력하세요.",
                    },
                  })}
                  type="number"
                />
              </InputForm>
              <div>{addMenuErrors.price?.message}</div>
              <InputForm>
                <Label>카테고리 :</Label>
                <Select
                  defaultValue={1}
                  {...addMenuReg("categoryId", {
                    required: "카테고리를 고르세요.",
                    min: {
                      value: 2,
                      message: "카테고리를 고르세요.",
                    },
                  })}
                >
                  <option value={1} disabled hidden>
                    카테고리
                  </option>
                  {categories?.slice(1).map((cat, index) => (
                    <option key={index} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </InputForm>
              <div>{addMenuErrors.categoryId?.message}</div>
              <InputForm>
                <Label>이미지 :</Label>
                <Input {...addMenuReg("image")} type="file" accept="image/*" />
              </InputForm>
              <Btns>
                <FormBtn>추가</FormBtn>
                <FormBtn onClick={() => setIsAddMenu(false)}>취소</FormBtn>
              </Btns>
            </BigForm>
          </>
        )}
        {isCat && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            ></Overlay>
            <BigCategory>
              <BigName>카테고리 추가하기</BigName>
              <SmallForm onSubmit={addCatSub(handleAddCat)}>
                <SmallInputForm>
                  <Label>이름 :</Label>
                  <Input
                    {...addCatReg("name", {
                      required: "카테고리명을 입력하세요.",
                      pattern: {
                        value: /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/,
                        message: "이름은 한글만 가능합니다.",
                      },
                      maxLength: {
                        value: 15,
                        message: "카테고리명은 15자 이내로 적어주세요.",
                      },
                    })}
                    type="text"
                  />
                  <SmallFormBtn>추가</SmallFormBtn>
                </SmallInputForm>
                <div>{addCatErrors.name?.message}</div>
              </SmallForm>
              <BigName>카테고리 수정하기</BigName>
              <SmallForm onSubmit={editCatSub(handleEditCat)}>
                <SmallInputForm>
                  <Label>카테고리 :</Label>
                  <Select defaultValue={1} {...editCatReg("prevName")}>
                    <option value={1} disabled hidden>
                      카테고리
                    </option>
                    {categories?.slice(1).map((cat, index) => (
                      <option key={index} value={index + 1}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  <SmallFormBtn style={{ visibility: "hidden" }} />
                </SmallInputForm>
                <SmallInputForm>
                  <Label>이름 :</Label>
                  <Input
                    {...editCatReg("name", {
                      required: "카테고리명을 입력하세요.",
                      pattern: {
                        value: /^[가-힣0-9\s]*$/,
                        message: "이름은 한글만 가능합니다.",
                      },
                      maxLength: {
                        value: 15,
                        message: "카테고리명은 15자 이내로 적어주세요.",
                      },
                    })}
                    type="text"
                  />
                  <SmallFormBtn>수정</SmallFormBtn>
                </SmallInputForm>
                <div>{editCatErrors.name?.message}</div>
              </SmallForm>
              <BigName>카테고리 삭제하기</BigName>
              <SmallForm onSubmit={removeCatSub(handleRemoveCat)}>
                <SmallInputForm>
                  <Label>카테고리 :</Label>
                  <Select defaultValue={1} {...removeCatReg("name")}>
                    <option value={1} disabled hidden>
                      카테고리
                    </option>
                    {categories?.slice(1).map((cat, index) => (
                      <option key={index} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  <SmallFormBtn>삭제</SmallFormBtn>
                </SmallInputForm>
              </SmallForm>
            </BigCategory>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Manage;
