import React, { useState, useEffect } from "react";
import api from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

type ItemFormProps = {
  isEdit?: boolean;
};

type Location = { id: number; name: string };
type Tag = { id: number; name: string };
type Group = { id: number; name: string };

export default function ItemForm({ isEdit = false }: ItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [locationId, setLocationId] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // 各選択肢データを取得
  useEffect(() => {
    api.get("locations/").then((res) => setLocations(res.data));
    api.get("tags/").then((res) => setTags(res.data));
    api.get("groups/").then((res) => setGroups(res.data));
  }, []);

  // 編集モードならデータを取得してセット
  useEffect(() => {
    if (isEdit && id) {
      api.get(`items/${id}/`).then((res) => {
        const item = res.data;
        setName(item.name);
        setDescription(item.description);
        setLocationId(item.location?.id ?? null);
        setGroupId(item.group?.id ?? null);
        setTagIds(item.tags.map((t: any) => t.id));
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      location: locationId || null,
      group: groupId || null,
      tags: tagIds,
    };

    // 🔽 ここで送信前にログ出力！
    console.log("送信データ:", payload);

    // ✅ itemId を先に宣言（新規 or 編集どちらでも使う）
    let itemId: string | undefined = id;

    try {
      if (isEdit && id) {
        await api.patch(`items/${id}/`, payload);
        navigate(`/items/${id}`);
      } else {
        const res = await api.post("items/", payload);
        itemId = res.data.id; // 新規作成時は ID を取得
      }

      // ✅ 画像アップロード（ファイルがあれば）
      if (imageFile && itemId) {
        const formData = new FormData();
        formData.append("image", imageFile);

        await api.post(`items/${itemId}/upload_image/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/items");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("送信時エラー:", err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error("送信時エラー:", err.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="block font-medium">名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block font-medium">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>

        <div>
          <label className="block font-medium">場所（Location）</label>
          <select
            value={locationId ?? ""}
            onChange={(e) => setLocationId(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          >
            <option value="">選択してください</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">グループ</label>
          <select
            value={groupId ?? ""}
            onChange={(e) => setGroupId(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          >
            <option value="">選択してください</option>
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">タグ</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={tagIds.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTagIds([...tagIds, tag.id]);
                    } else {
                      setTagIds(tagIds.filter((id) => id !== tag.id));
                    }
                  }}
                  className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium">画像アップロード</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
              }
            }}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isEdit ? "更新する" : "登録する"}
        </button>
      </form>
    </div>
  );
}
