import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

// Item型を定義
type Item = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  location: number;
  owner: number;
  group: number;
  tags: number[];
  images?: { id: number; image: string; uploaded_at: string }[];
};

export default function ItemList() {
  const { data, isPending, error } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: () => api.get("items/").then((res) => res.data),
  });

  if (isPending) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">アイテム一覧</h1>
      <ul className="space-y-2">
        {data?.map((item) => (
          <li
            key={item.id}
            className="border rounded p-2 flex items-start gap-4 max-w-full overflow-hidden"
          >
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0].image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded shrink-0"
                style={{ maxWidth: "96px", maxHeight: "96px" }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 text-center flex items-center justify-center text-sm text-gray-500 rounded shrink-0">
                画像なし
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-sm text-gray-600 line-clamp-3 break-words">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
