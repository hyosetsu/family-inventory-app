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
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-wide">Family Inventory</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
