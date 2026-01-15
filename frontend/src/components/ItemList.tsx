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
          <li key={item.id} className="border rounded p-2">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
