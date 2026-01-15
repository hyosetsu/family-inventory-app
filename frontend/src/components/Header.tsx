import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // トークン削除
    navigate("/login"); // ログインページへリダイレクト
  };

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <h1 className="text-lg font-bold">Family Inventory</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        ログアウト
      </button>
    </header>
  );
}
