import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import { adminState, isLogin } from "../../atom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CommonButton } from "../../Utils/Common/CommonButton";
import { CommonContainer } from "../../Utils/Common/CommonContainer";

/** 전부 */
const Wrapper = styled(CommonContainer)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
/** 폼 */
const LoginForm = styled.form`
  width: fit-content;
  min-width: 500px;
  min-height: 300px;
  height: fit-content;
  padding: 5% 10%;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-color: ${(props) => props.theme.bg.yellow};
`;
/** 레이블 + input */
const Slot = styled(CommonContainer)`
  width: 100%;
  height: 100px;
  gap: 20px;
`;
/** input 레이블 */
const Label = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  cursor: auto;
`;
/** 폼 내용 */
const Input = styled.input`
  width: 200px;
  height: 40px;
  border: none;
  border-radius: 20px;
  padding: 0 10px;
  &::placeholder {
    text-align: center;
    color: white;
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
/** 모든 button 태그 */
const Btn = styled(CommonButton)`
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.red.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`};
`;
/** 오류 메시지 */
const Msg = styled(motion.div)`
  position: fixed;
  top: 30%;
  width: 90%;
  font-size: 48px;
  text-align: center;
  color: black;
`;
interface IForm {
  id: string;
  password: string;
}
function Login() {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setAdmin = useSetRecoilState(adminState);
  const [login, setLogin] = useRecoilState(isLogin);
  const [isMsgHidden, setIsMsgHidden] = useState(false);
  const handleLogin = (data: IForm) => {
    if (!login) {
      if (data.id === "admin" && data.password === "tlsrhkdms") {
        // 비밀번호 신과은
        moveToTable();
        sessionStorage.setItem("admin", "admin");
      } else {
        setIsMsgHidden(true);
        setValue("id", "");
        setValue("password", "");
        document.querySelector("input")?.focus();
      }
    }
  };
  const moveToTable = () => {
    setLogin(true);
    setAdmin("테이블");
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(handleLogin)();
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("admin") === "admin") {
      moveToTable();
    } else {
      document.querySelector("input")?.focus();
    }
  }, []);
  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit(handleLogin)}>
        <Slot>
          <Label disabled>아이디</Label>
          <Input
            {...register("id", { required: true })}
            placeholder="아이디"
            type="text"
            onKeyDown={handleKeyDown}
          />
        </Slot>
        <Slot>
          <Label disabled>비밀번호</Label>
          <Input
            {...register("password", { required: true })}
            placeholder="비밀번호"
            type="password"
            onKeyDown={handleKeyDown}
          />
        </Slot>
        <Btn>로그인</Btn>
      </LoginForm>
      {isMsgHidden && (
        <Msg
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setIsMsgHidden(false)}
        >
          아이디 또는 비밀번호가 일치하지 않습니다.
        </Msg>
      )}
    </Wrapper>
  );
}
export default Login;
