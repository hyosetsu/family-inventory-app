import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ItemList from "./components/ItemList";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ItemForm from "./components/ItemForm";

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
        {/* 🔽 ここが今回追加した2つ！ */}
        <Route
          path="/items/new"
          element={
            <ProtectedRoute>
              <ItemForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <ProtectedRoute>
              <ItemForm isEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
