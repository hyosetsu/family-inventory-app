import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // 作成済みのログイン画面
import ItemList from "./components/ItemList";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
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
  );
}
