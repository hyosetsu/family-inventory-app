import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";

type ItemDetailProps = {
  id: number;
  name: string;
  description: string;
  images: { id: number; image: string; uploaded_at: string }[];
  location: { id: number; name: string };
  group: { id: number; name: string };
  tags: { id: number; name: string }[];
};

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<ItemDetailProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.get(`items/${id}/`).then((res) => {
        setItem(res.data);
      });
    }
  }, [id]);

  if (!item) return <p>読み込み中...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{item.name}</h1>
      <div className="mb-4">
        {item.images.length > 0 ? (
          <img
            src={item.images[0].image}
            alt={item.name}
            className="w-72 h-72 object-cover rounded"
          />
        ) : (
          <p>画像なし</p>
        )}
      </div>
      <p>{item.description}</p>
      <p>場所: {item.location.name}</p>
      <p>グループ: {item.group.name}</p>
      <p>タグ: {item.tags.map((tag) => tag.name).join(", ")}</p>

      <div className="mt-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/items/${id}/edit`)}
        >
          編集
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => {
            /* 削除機能をここに追加 */
          }}
        >
          削除
        </button>
      </div>
    </div>
  );
}
