import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Home from "./Routes/Home";
import Admin from "./Routes/Admin";
import Custom from "./Routes/Custom";
import NotFound from "./Routes/NotFound";
/**
 * @abstract
 * Router 구조 파일
 */
function Router() {
  return (
    // <BrowserRouter>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/custom/:menuName" element={<Custom />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/table/:tableNumber" element={<Admin />} />
        <Route path="/admin/manage/:menuId" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
    //</BrowserRouter>
  );
}

export default Router;
