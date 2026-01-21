import { useState, useEffect } from "react";
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
        setLocationId(item.location);
        setGroupId(item.group);
        setTagIds(item.tags);
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      location: locationId,
      group: groupId,
      tags: tagIds,
    };

    // 🔽 ここで送信前にログ出力！
    console.log("送信データ:", payload);

    try {
      if (isEdit && id) {
        await api.put(`items/${id}/`, payload);
      } else {
        await api.post("items/", payload);
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block font-medium">名前</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
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
          className="border px-2 py-1 w-full"
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
          className="border px-2 py-1 w-full"
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
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEdit ? "更新する" : "登録する"}
      </button>
    </form>
  );
}
