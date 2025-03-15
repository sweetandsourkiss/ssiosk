import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { initDevice } from "../Api/Rpi/MainApis";
import { CommonButton } from "../Utils/Common/CommonButton";
import { CommonContainer } from "../Utils/Common/CommonContainer";
import CommonServiceLogo from "../Utils/Common/CommonServiceLogo";
/** 정렬을 위한 Wrapper */
const Wrapper = styled(CommonContainer)`
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none; // 드래그 방지
`;
/** 초기 화면 안내 문구 */
const TouchScreen = styled(motion.div)`
  margin-top: 50px;
  text-align: center;
  color: black;
  font-size: 2rem;
`;
const TableForm = styled(motion.form)`
  position: fixed;
  width: 60vw;
  height: 50vh;
  margin: auto;
  background-color: ${(props) => props.theme.bg.yellow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5% 0;
  border-radius: 50px;
  font-size: 20px;
  color: black;
`;
const InputForm = styled.div`
  width: 80%;
  height: 90%;
  background-color: ${(props) => props.theme.bg.yellow};
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 0 15px;
  justify-content: space-between;
  color: black;
`;
const Btn = styled(CommonButton)`
  width: 30%;
  height: 20%;
  min-height: 50px;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  cursor: auto;
`;
const ClearBtn = styled(CommonButton)`
  width: 30%;
  height: 20%;
  min-height: 50px;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.red.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`};
`;
const Input = styled(motion.input)`
  width: 60%;
  height: 20%;
  border: none;
  border-radius: 20px;
  &::placeholder {
    text-align: center;
    color: black;
    font-weight: bold;
  }
  &:focus,
  &:active {
    outline: none;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
interface IForm {
  tableNumber: string;
}
function Home() {
  /** 라우터 */
  const history = useNavigate();
  /** States */
  /** useForm */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  /** useAnimation */
  const [nowKey, setNowKey] = useState(-1);
  const formAnimation = useAnimation();
  /** 로딩 애니메이션이 끝나면 실행 */
  /** Custom 으로 이동 */
  const moveToMain = () => {
    if (sessionStorage.getItem("tableNumber")) history("custom");
    else {
      formAnimation.start({
        scale: 1,
      });
    }
  };
  /** tableNo 설정(사장님이 한다) */
  const setTableNumber = (data: IForm) => {
    sessionStorage.setItem("tableNumber", data.tableNumber);
    moveToMain();
  };
  useEffect(() => {
    /** rbpi 서버 통신 */
    initDevice();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      setNowKey(event.keyCode);
      const key = event.keyCode;
      if (key >= 48 && key <= 57) {
        moveToMain();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nowKey]);
  return (
    <Wrapper onClick={moveToMain}>
      <CommonServiceLogo />
      <TouchScreen
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        주문하려시면 화면을 터치하세요
      </TouchScreen>
      <AnimatePresence>
        <TableForm
          onSubmit={handleSubmit(setTableNumber)}
          initial={{ scale: 0 }}
          animate={formAnimation}
          transition={{ type: "tween" }}
        >
          <div>{errors.tableNumber?.message}</div>
          <InputForm>
            <Btn>테이블번호</Btn>
            <Input
              {...register("tableNumber", {
                required: "번호를 입력하세요",
                max: { value: 99, message: "테이블 최대 번호는 99입니다." },
                min: { value: 1, message: "테이블 최소 번호는 1입니다." },
              })}
              placeholder="테이블 번호를 입력하세요"
              type="number"
            />
          </InputForm>
          <ClearBtn>설정</ClearBtn>
        </TableForm>
      </AnimatePresence>
    </Wrapper>
  );
}

export default Home;
