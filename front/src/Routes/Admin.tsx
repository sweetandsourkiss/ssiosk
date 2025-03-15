import { useState } from "react";
import { useRecoilState } from "recoil";
import Login from "../Components/Admin/Login";
import NowTable from "../Components/Admin/NowTable";
import Manage from "../Components/Admin/Manage";
import { useEffect } from "react";
import { adminState } from "../atom";
import { styled } from "styled-components";
import { useMatch } from "react-router-dom";
import { CommonTeamLogoSvg } from "../Utils/Common/CommonTeamLogoSvg";
import { CommonScrollDiv } from "../Utils/Common/CommonScrollDiv";
import { CommonButton } from "../Utils/Common/CommonButton";
import { CommonContainer } from "../Utils/Common/CommonContainer";
import { CommonServiceLogoDiv } from "../Utils/Common/CommonServiceLogoDiv";
/** 전체 컨테이너 */
const Wrapper = styled(CommonContainer)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1% 0;
`;
/** 메인 컨테이너 */
const Main = styled(CommonContainer)`
  width: 80%;
  height: 100%;
  flex-direction: column;
`;
/** 사이드 컨테이너 */
const Side = styled(CommonContainer)<{ $adminMode: string }>`
  flex-direction: column;
  width: 18%;
  height: 85%;
  background-color: ${(props) =>
    props.$adminMode === "로그인" ? "transparent" : props.theme.bg.yellow};
  /* background-color: tomato; */
`;
/** 메인 헤더 */
const MainHeader = styled(CommonContainer)`
  width: 100%;
  height: 15%;
  padding: 0 3%;
`;
/** 메인 바디 */
const MainBody = styled(CommonScrollDiv)<{ $adminMode: string }>`
  width: 100%;
  height: 85%;
  padding: 10px;
  background-color: ${(props) =>
    props.$adminMode === "로그인" ? "white" : props.theme.bg.yellow};
  &::-webkit-scrollbar {
    width: 0px;
  }
`;
/** 로고 */
const Logo = styled(CommonServiceLogoDiv)``;
const TeamLogo = styled(CommonServiceLogoDiv)`
  font-size: 32px;
  color: black;
  margin: 20px auto;
`;
/** 탭 두개 */
const Tabs = styled.div`
  margin-left: auto;
  display: flex;
`;
const Tab = styled(CommonButton)<{ $isSelected: boolean }>`
  box-shadow: ${(props) =>
    props.$isSelected
      ? `0 4px 0 0 ${props.theme.btn.red.shadow}`
      : `0 4px 0 0 ${props.theme.btn.violet.shadow}`};
  background: ${(props) =>
    props.$isSelected
      ? `linear-gradient(0deg, ${props.theme.btn.red.start}, ${props.theme.btn.red.end})`
      : `linear-gradient(0deg,  ${props.theme.btn.violet.start}, ${props.theme.btn.violet.end})`};
  font-size: 24px;
  cursor: pointer;
  margin: 0 8px;
`;
const STATE_LOGIN = "로그인";
const STATE_TABLE = "테이블";
const STATE_MANAGE = "관리";
function Admin() {
  const [admin, setAdmin] = useRecoilState(adminState);
  const [selectedTab, setSelectedTab] = useState(STATE_TABLE);
  const tabs = [STATE_TABLE, STATE_MANAGE];
  const tableMatch = useMatch("/admin/table/:tableNo");
  const menuMatch = useMatch("/admin/manage/:menuId");
  const toggleTab = (tabName: string) => {
    if (selectedTab !== tabName) {
      setSelectedTab(tabName);
      setAdmin(tabName);
    }
  };
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin && admin === "admin") {
      if (tableMatch?.params.tableNo) {
        setAdmin(STATE_TABLE);
      } else if (menuMatch?.params.menuId) {
        setAdmin(STATE_MANAGE);
        setSelectedTab(STATE_MANAGE);
      }
    } else {
      setAdmin(STATE_LOGIN);
    }
  }, []);
  return (
    <Wrapper>
      <Main>
        <MainHeader>
          <Logo>SSIOSK manager mode</Logo>
          <Tabs>
            {admin !== STATE_LOGIN && (
              <>
                {tabs.map((tab) => (
                  <Tab
                    onClick={() => toggleTab(tab)}
                    $isSelected={tab === selectedTab}
                    key={tab}
                  >
                    {tab}
                  </Tab>
                ))}
              </>
            )}
          </Tabs>
        </MainHeader>
        <MainBody $adminMode={admin}>
          {admin === STATE_LOGIN ? <Login key={STATE_LOGIN} /> : null}
          {admin === STATE_TABLE ? <NowTable key={STATE_TABLE} /> : null}
          {admin === STATE_MANAGE ? <Manage key={STATE_MANAGE} /> : null}
        </MainBody>
      </Main>
      <Side $adminMode={admin}>
        {admin === STATE_TABLE && (
          <>
            <CommonTeamLogoSvg />
            <TeamLogo>&copy; 개발새발</TeamLogo>
          </>
        )}
      </Side>
    </Wrapper>
  );
}
export default Admin;
