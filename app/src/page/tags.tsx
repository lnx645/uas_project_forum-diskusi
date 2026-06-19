import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunction } from "react-router";
import { HiOutlineTag, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useWebSocket } from "../contexts/WebsocketContext";
import { api } from "../core/api";
import { useTagStore } from "../store/useTagStore";
import { formatReputation } from "../core/formatter";

export const loader: LoaderFunction = async () => {
  const response = await api.get("/api/tags");
  return response.data;
};

export const Component = () => {
  const initialTags = useLoaderData() as any[];
  const { tags, setTags, addTag } = useTagStore();
  const { stompClient, isConnected } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags);
    }
  }, [initialTags, setTags]);

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const subscription = stompClient.subscribe("/topic/tags", (message) => {
      const newTag = JSON.parse(message.body);
      addTag(newTag);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [stompClient, isConnected, addTag]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-5 min-h-screen font-sans min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-(--theme-content-border-color) pb-3 mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-(--theme-body-font-color) flex items-center gap-2">
            <HiOutlineTag className="text-(--theme-link-color)" /> Daftar
            Kategori Tag
          </h1>
          <p className="text-xs text-(--black-500) mt-1 max-w-2xl leading-relaxed">
            Gunakan indeks tag di bawah ini untuk memfilter topik diskusi. Data
            tersinkronisasi langsung secara berkala.
          </p>
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <HiOutlineMagnifyingGlass className="absolute left-2.5 top-2.5 text-(--black-300) text-sm" />
          <input
            type="text"
            placeholder="Filter nama tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-(--theme-button-outlined-border-color) rounded-sm bg-white text-(--theme-body-font-color) focus:border-(--theme-primary-custom-400) focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[10px]  font-bold uppercase tracking-wider text-(--black-500) bg-(--black-100) px-2 py-1 rounded-sm border border-(--theme-content-border-color)">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-600" : "bg-rose-500"}`}
          ></span>
          {isConnected ? "SYNC: ONLINE" : "SYNC: OFFLINE"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-3 bg-(--theme-content-background-color) border border-[#d8d8d88c] rounded-sm flex flex-col justify-between min-h-30"
            >
              <div>
                <div className="mb-2">
                  <span className="inline-block bg-[#f2f0f0]  text-[#0000008c] px-1.5 py-0.5 rounded-sm text-[11px]  font-bold">
                    {tag.name}
                  </span>
                </div>
                <p className="text-[11.5px] text-(--theme-body-font-color) line-clamp-3 leading-relaxed font-normal">
                  {tag.description ||
                    "Tidak ada keterangan deskripsi untuk topik kategori ini."}
                </p>
              </div>

              <div className="text-[10px] text-(--black-500) font-medium pt-2 border-t border-(--theme-content-border-color) mt-3 flex justify-between items-center ">
                <span className="font-bold text-(--theme-link-color)">
                  {formatReputation(tag.questionCount || 0)} posts
                </span>
                <span className="opacity-70">
                  {tag.createdAt
                    ? new Date(tag.createdAt).toLocaleDateString("id-ID")
                    : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-(--theme-content-background-color) border-2 border-(--theme-content-border-color) border-dashed rounded-sm text-xs text-(--black-300) ">
            [!] Kategori "{searchQuery}" tidak ditemukan dalam indeks data.
          </div>
        )}
      </div>
    </div>
  );
};
