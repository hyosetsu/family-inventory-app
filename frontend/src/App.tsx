import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ItemList from "./components/ItemList";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

export default function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* ログインページ以外でヘッダー表示 */}
      {!isLoginPage && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
