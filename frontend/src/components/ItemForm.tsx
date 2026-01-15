import { useState, useEffect } from "react";
import api from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";

type ItemFormProps = {
  isEdit?: boolean;
};

export default function ItemForm({ isEdit = false }: ItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // 編集時、初期データを取得
  useEffect(() => {
    if (isEdit && id) {
      api.get(`items/${id}/`).then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { name, description };

    if (isEdit && id) {
      await api.put(`items/${id}/`, payload);
    } else {
      await api.post("items/", payload);
    }

    navigate("/items");
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEdit ? "更新する" : "登録する"}
      </button>
    </form>
  );
}
