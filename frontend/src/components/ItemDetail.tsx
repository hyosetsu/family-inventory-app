import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// アイテム詳細用の型
type ItemDetail = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  location: { id: number; name: string };
  owner: { id: number; username: string };
  group: { id: number; name: string };
  tags: { id: number; name: string }[];
  images: { id: number; image: string; uploaded_at: string }[];
};

export default function ItemDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<ItemDetail>({
    queryKey: ["item", id],
    queryFn: () => api.get(`items/${id}`).then((res) => res.data),
  });

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data?.name}</h1>
      <p className="text-sm text-gray-600">{data?.description}</p>
      <div className="mt-4">
        {/* ロケーションの表示 */}
        <p>ロケーション: {data?.location?.name || "未設定"}</p>
        {/* グループの表示 */}
        <p>グループ: {data?.group?.name || "未設定"}</p>
        {/* タグの表示 */}
        <p>タグ: {data?.tags?.map((tag) => tag.name).join(", ") || "未設定"}</p>
      </div>
      <div className="mt-4">
        <h2>画像</h2>
        <div className="flex gap-4">
          {data?.images.map((image) => (
            <img
              key={image.id}
              src={image.image}
              alt="Item Image"
              className="w-32 h-32 object-contain rounded" // object-contain を使って画像が枠内に収まるようにする
              style={{
                maxWidth: "300px", // 画像の最大幅を指定
                maxHeight: "300px", // 画像の最大高さを指定
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
