import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuth } from "../contexts/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("token/", { username, password });
      login(res.data.access); // トークン保存
      navigate("/items"); // 成功後リダイレクト
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        setError("ログインに失敗しました");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">ユーザー名</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">パスワード</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
