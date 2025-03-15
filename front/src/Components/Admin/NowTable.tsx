import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import {
  deleteOrder,
  getOrders,
  modifyOrder,
  tableExitProcess,
} from "../../Api/Spring/OrderApis";
import { useRecoilState } from "recoil";
import { totalMenus } from "../../atom";
import { getMenus } from "../../Api/Spring/MenuApis";
import { CommonBigModalHeader } from "../../Utils/Common/CommonBigModalHeader";
import { CommonBigModal } from "../../Utils/Common/CommonBigModal";
import { CommonGrid } from "../../Utils/Common/CommonGrid";
import { CommonGridElement } from "../../Utils/Common/CommonGridElement";
import { CommonButton } from "../../Utils/Common/CommonButton";
import { CommonContainer } from "../../Utils/Common/CommonContainer";
import { CommonServiceLogoDiv } from "../../Utils/Common/CommonServiceLogoDiv";
import CommonOrderCompleteAudio from "../../Utils/CommonOrderCompleteAudio";
const Wrapper = styled(CommonContainer)``;
const Tables = styled(CommonGrid)`
  ::-webkit-scrollbar,
  ::-webkit-scrollbar-track {
    width: 0;
  }
`;
const Table = styled(CommonGridElement)`
  border: solid 10px ${(props) => props.theme.text.greenBlue};
  justify-content: flex-start;
`;
const SmallHeader = styled(CommonBigModalHeader)``;
const Title = styled.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  aspect-ratio: 1/1;
  background-color: ${(props) => props.theme.text.greenBlue};
  color: white;
  text-align: center;
  margin: 0 auto;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const Menu = styled.div`
  display: flex;
  width: 100%;
  font-size: 15px;
  font-weight: bold;
`;
const Name = styled.div`
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Qty = styled.div`
  margin-left: auto;
`;
/** 음식 상세보기 시 오버레이 컴포넌트 */
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
/** 음식 상세보기 컴포넌트 */
const BigTable = styled(CommonBigModal)``;
/** 로고 */
const Logo = styled(CommonServiceLogoDiv)``;
const Xbtn = styled.div`
  font-size: 32px;
  cursor: pointer;
`;
/** 음식 상세보기 설명 컴포넌트 */
const BigOverview = styled.div`
  width: 100%;
  height: 80%;
  font-size: 16px;
  color: black;
  gap: 10px;
  flex-direction: column;
  justify-content: start;
  display: flex;
  padding-top: 2%;
  padding-right: 1%;
  margin-bottom: 30px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
const BigResult = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: white;
`;
const TablePrice = styled.div`
  width: 60%;
  font-size: 32px;
  font-weight: bolder;
  text-align: center;
  padding: 5px 0;
`;
const TableNumber = styled(CommonButton)`
  font-size: 32px;
  font-weight: bolder;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
`;
const TableClear = styled(CommonButton)`
  font-size: 32px;
  font-weight: bolder;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.red.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`};
  cursor: pointer;
`;
const Bucket = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Infos = styled(CommonContainer)`
  display: grid;
  grid-template-columns: 40% 40% 10%;
  justify-content: space-around;
  background-color: white;
  padding: 10px 0;
  padding-left: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 70%;
`;
const Info = styled.div`
  color: black;
  font-size: 22px;
  font-weight: bolder;
`;
const Btns = styled.div`
  display: flex;
  margin-right: 0;
  gap: 20px;
`;
/** 버튼 */
const Btn = styled(CommonButton)`
  /* width: 100px; */
  width: fit-content;
  height: 40px;
  box-shadow: ${(props) => `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
`;
interface ITable {
  tableNumber: number;
  id: number;
  menuId: number;
  quantity: number;
  orderedAt: string;
  completedAt: string;
}
function NowTable() {
  /** recoil */
  const [menus, setMenus] = useRecoilState(totalMenus);
  const [tables, setTables] = useState<ITable[]>([]);
  let sum = 0;
  const history = useNavigate();
  const bigTableMatch = useMatch("/admin/table/:tableNumber");
  const audioRef = useRef<HTMLAudioElement>(null);
  /** 클릭한 테이블 찾기 */
  let clickedTable: any =
    bigTableMatch?.params.tableNumber &&
    tables.find((table: any) => {
      return String(table[0].tableNumber) === bigTableMatch?.params.tableNumber;
    });
  const onOverlayClick = () => {
    if (clickedTable) {
      history(-1);
    }
    clickedTable = "";
  };
  const onTableClick = (tableNumber: number) => {
    history(`/admin/table/${tableNumber}`);
  };
  /** 주문 수량 관리 */
  const handleModifyOrder = async (order: any, isAdd: boolean) => {
    if (isAdd) {
      if (window.confirm("해당 메뉴를 추가 주문 하시겠습니까?")) {
        order.quantity = order.quantity + 1;
        await modifyOrder(order);
      }
    } else {
      if (window.confirm("해당 메뉴를 감소시키겠습니까?")) {
        if (order.quantity === 1) {
          alert("1개 미만으로는 감소시킬수 없습니다!!");
        } else {
          order.quantity = order.quantity - 1;
          await modifyOrder(order);
        }
      }
    }
    init();
  };
  /** 주문 삭제 */
  const removeOrder = async (order: any) => {
    if (window.confirm("주문을 삭제하시겠습니까?")) {
      await deleteOrder(order.id);
    }
    alert("주문이 삭제되었습니다.");
    init();
  };
  /** 주문 처리 */
  const clearTable = async () => {
    if (window.confirm("계산을 완료하시겠습니까?")) {
      await tableExitProcess(clickedTable[0].tableNumber);
      clickedTable = "";
      alert("계산이 완료되었습니다.");
      history(-1);
      init();
    }
  };
  /** 초기 실행 */
  const init = async () => {
    const allMenus = await getMenus();
    setMenus(allMenus);
    const orders: ITable[] = await getOrders();
    const ordersToTables = new Map();
    for (const order of orders) {
      if (order?.completedAt) {
        continue;
      }
      const { tableNumber } = order;
      if (ordersToTables.has(tableNumber)) {
        ordersToTables.get(tableNumber).push(order);
      } else {
        ordersToTables.set(tableNumber, [order]);
      }
    }
    const arr = Array.from(ordersToTables.values());
    setTables(arr);
    /** 웹소켓 통신 */
    const server = "wss://i9a201.p.ssafy.io/ws/order";
    const client = new WebSocket(server);
    client.addEventListener("open", () => {
      console.log("WebSocket Connected");
      // 타임아웃 설정 (밀리초 단위)
      const timeoutDuration = 3600000 * 24 * 7; // 하루 * 7
      let timeoutId = setTimeout(() => {
        console.log(
          `WebSocket connection timed out after ${timeoutDuration} milliseconds.`
        );
        client.close();
      }, timeoutDuration);
      // 메세지를 수신할 때마다 타임아웃 재설정
      client.addEventListener("message", async (event) => {
        audioRef.current?.play();
        // console.log(JSON.parse(event.data));
        await init();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log(
            `WebSocket connection timed out after ${timeoutDuration} milliseconds.`
          );
          client.close();
        }, timeoutDuration);
      });
    });
    client.addEventListener("error", (error) => {
      console.error("WebSocket Error:", error);
    });

    client.addEventListener("close", (event) => {
      if (event.wasClean) {
        console.log(
          `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error("WebSocket Connection Closed Unexpectedly");
      }
    });
  };
  useEffect(() => {
    init();
  }, []);
  console.log();
  return (
    <Wrapper>
      <Tables>
        {tables.map((table: any, index) => {
          return (
            <div key={table[0].tableNumber}>
              <Table
                key={index}
                onClick={() => {
                  onTableClick(table[0].tableNumber);
                }}
              >
                <Title key={index}>{table[0].tableNumber}</Title>

                {table.map((food: any) => {
                  const name = menus.find(
                    (menu) => menu.id === food.menuId
                  )?.name;
                  return (
                    <Menu key={food.orderedAt}>
                      <Name>{name}</Name>
                      <Qty>{food.quantity}개</Qty>
                    </Menu>
                  );
                })}
              </Table>
            </div>
          );
        })}
      </Tables>
      {bigTableMatch ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          ></Overlay>
          <BigTable exit={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {clickedTable && (
              <>
                <SmallHeader>
                  <Logo>테이블 상세정보</Logo>
                  <Xbtn
                    onClick={() => {
                      history(-1);
                    }}
                  >
                    ❌
                  </Xbtn>
                </SmallHeader>
                <BigOverview>
                  {clickedTable.map((food: ITable) => {
                    const name = menus.find(
                      (menu) => menu.id === food.menuId
                    )?.name;
                    const price =
                      menus.find((menu) => menu.id === food.menuId)?.price || 0;
                    sum += price * food.quantity;
                    return (
                      <Bucket key={food.orderedAt}>
                        <Infos>
                          <Info>{name}</Info>
                          <Info>
                            {(price * food.quantity).toLocaleString("ko-KR")}원
                          </Info>
                          <Info>{food.quantity}개</Info>
                        </Infos>
                        <Btns>
                          <Btn onClick={() => handleModifyOrder(food, true)}>
                            {/* 증가 */}+
                          </Btn>
                          <Btn onClick={() => handleModifyOrder(food, false)}>
                            {/* 감소 */}-
                          </Btn>
                          <Btn onClick={() => removeOrder(food)}>삭제</Btn>
                        </Btns>
                      </Bucket>
                    );
                  })}
                </BigOverview>
                <BigResult>
                  <TableNumber>{clickedTable[0].tableNumber}</TableNumber>
                  <TablePrice>총 {sum.toLocaleString("ko-KR")}원</TablePrice>
                  <TableClear onClick={clearTable}>결제</TableClear>
                </BigResult>
              </>
            )}
          </BigTable>
        </>
      ) : null}
      {/* <CommonOrderCompleteAudio /> */}
    </Wrapper>
  );
}

export default NowTable;
