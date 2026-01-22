import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

type Location = { id: number; name: string };
type Tag = { id: number; name: string };
type Group = { id: number; name: string };
type User = { id: number }; 

export default function ItemList() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  useEffect(() => {
    api
      .get("users/me/") // ユーザー情報を取得するエンドポイント
      .then((response) => {
        setCurrentUser(response.data.id); // ユーザーIDをセット
      })
      .catch((error) => {
        console.error("ユーザー情報の取得に失敗:", error);
      });
  }, []);

  const { data, isPending, error } = useQuery<Item[]>({
    queryKey: ["items", selectedLocation, selectedTag, selectedGroup],
    queryFn: () =>
      api
        .get("items/", {
          params: {
            location: selectedLocation,
            tag: selectedTag,
            group: selectedGroup,
          },
        })
        .then((res) => res.data),
  });

  // APIからロケーション、タグ、グループデータを取得
  const { data: locations } = useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: () => api.get("locations/").then((res) => res.data),
  });

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => api.get("tags/").then((res) => res.data),
  });

  const { data: groups } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => api.get("groups/").then((res) => res.data),
  });

  if (isPending) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">アイテム一覧</h1>

      {/* フィルターフォーム */}
      <div className="mb-4">
        <label className="mr-2">ロケーション</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">すべて</option>
          {locations?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>

        <label className="ml-4 mr-2">タグ</label>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">すべて</option>
          {tags?.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <label className="ml-4 mr-2">グループ</label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">すべて</option>
          {groups?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* アイテム一覧 */}
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

            {/* 現在のユーザーが所有者の場合のみ編集ボタンを表示 */}
            {currentUser !== null && item.owner === currentUser && (
              <Link
                to={`/items/${item.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                編集
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
