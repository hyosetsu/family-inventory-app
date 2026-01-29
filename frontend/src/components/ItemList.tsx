import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ユーザー情報を取得
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api.get("users/me/").then((res) => res.data),
  });

  useEffect(() => {
    if (user) {
      setCurrentUser(user.id);
    }
  }, [user]);

  // アイテムのデータを取得
  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = useQuery<Item[], Error>({
    queryKey: [
      "items",
      selectedLocation,
      selectedTag,
      selectedGroup,
      searchQuery,
    ],
    queryFn: async () => {
      const res = await api.get<Item[]>("items/", {
        params: {
          location: selectedLocation,
          tag: selectedTag,
          group: selectedGroup,
          name: searchQuery,
        },
      });
      return res.data;
    },
    enabled: !!currentUser,
  });

  // ロケーション、タグ、グループのデータを取得
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

  // currentUserがセットされた後にアイテムのデータを取得する
  useEffect(() => {
    if (currentUser !== null) {
      // currentUserが設定されると自動でアイテムを取得
      refetch(); // アイテムのデータをリフェッチ
    }
  }, [
    currentUser,
    selectedLocation,
    selectedTag,
    selectedGroup,
    searchQuery,
    refetch,
  ]); // currentUserが変更された時にアイテムデータをリフェッチ

  if (userLoading || isLoading) return <p>読み込み中...</p>;
  if (userError || error) return <p>エラーが発生しました</p>;

  const handleSearchSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">アイテム一覧</h1>

      <Link
        to="/items/new"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + アイテム追加
      </Link>

      {/* フィルターフォーム */}
      <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">すべてのロケーション</option>
            {locations?.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">すべてのタグ</option>
            {tags?.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">すべてのグループ</option>
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            検索
          </button>
        </div>
      </div>

      {/* アイテム一覧 */}
      <ul className="space-y-4">
        {items?.map((item) => (
          <li
            key={item.id}
            className="bg-white border rounded-lg p-4 flex gap-4 hover:shadow transition"
          >
            <Link to={`/items/${item.id}`} className="shrink-0">
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
            </Link>
            <div className="flex-1 overflow-hidden">
              <Link
                to={`/items/${item.id}`}
                className="font-semibold truncate text-blue-700 hover:underline"
              >
                {item.name}
              </Link>
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
