import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { useState } from "react";

// 型定義
type ItemDetail = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  location: { id: number; name: string } | null;
  owner: { id: number; username: string };
  group: { id: number; name: string } | null;
  tags: { id: number; name: string }[];
  images: { id: number; image: string; uploaded_at: string }[];
};

type User = {
  id: number;
};

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // アイテム取得
  const { data, isLoading, error } = useQuery<ItemDetail>({
    queryKey: ["item", id],
    queryFn: () => api.get(`items/${id}/`).then((res) => res.data),
  });

  // ログインユーザー取得
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api.get("users/me/").then((res) => res.data),
  });

  if (isLoading) return <p>読み込み中...</p>;
  if (error || !data) return <p>エラーが発生しました</p>;

  const isOwner = user?.id === data.owner.id;

  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm("このアイテムを削除しますか？")) return;
    await api.delete(`items/${data.id}/`);
    navigate("/items");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* 戻る */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ← 一覧へ戻る
      </button>

      <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
      <p className="text-gray-700 whitespace-pre-wrap">{data.description}</p>

      <div className="mt-4 space-y-1 text-sm">
        <p>ロケーション: {data.location?.name || "未設定"}</p>
        <p>グループ: {data.group?.name || "未設定"}</p>
        <p>
          タグ:{" "}
          {data.tags.length > 0
            ? data.tags.map((tag) => tag.name).join(", ")
            : "未設定"}
        </p>
      </div>

      {/* 画像一覧 */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">画像</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.images.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt="Item"
              onClick={() => setSelectedImage(image.image)}
              className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      </div>

      {/* owner限定ボタン */}
      {isOwner && (
        <div className="mt-6 flex gap-3">
          <Link
            to={`/items/${data.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        </div>
      )}

      {/* 画像モーダル */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
