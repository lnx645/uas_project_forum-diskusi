import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebsocketContext";
import { api } from "../core/api";
import { Link } from "react-router";

interface TagData {
  id?: string;
  name: string;
  questionCount?: number;
}

interface ContributorData {
  username: string;
  name: string;
  reputation: number;
}

export const SidebarWidgets = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const { stompClient, isConnected } = useWebSocket();

  useEffect(() => {
    api
      .get("/api/tags")
      .then((res) => {
        if (Array.isArray(res.data)) setTags(res.data.slice(0, 8));
      })
      .catch((err) => console.error("Gagal memuat tags:", err));

    api
      .get("/api/users/top")
      .then((res) => {
        if (Array.isArray(res.data)) setContributors(res.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("Gagal memuat kontributor:", err);
        setContributors([
          { username: "dadan_h", name: "Dadan Hidayat", reputation: 1420 },
          { username: "mang_komar", name: "Mang Komar", reputation: 890 },
          { username: "gufron_ka", name: "KA Gufron", reputation: 750 },
        ]);
      });
  }, []);
  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const tagSub = stompClient.subscribe("/topic/tags", (message) => {
      try {
        const updatedTag = JSON.parse(message.body) as TagData;
        setTags((prev) => {
          const exists = prev.some((t) => t.name === updatedTag.name);
          if (exists) {
            return prev
              .map((t) => (t.name === updatedTag.name ? updatedTag : t))
              .sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0));
          }
          return [...prev, updatedTag].sort(
            (a, b) => (b.questionCount || 0) - (a.questionCount || 0),
          );
        });
      } catch (err) {
        console.error("Gagal membaca update tag via WebSocket:", err);
      }
    });

    return () => {
      if (tagSub) tagSub.unsubscribe();
    };
  }, [stompClient, isConnected]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="border border-stone-200 bg-white p-4 rounded shadow-xs flex flex-col gap-2">
        <h3 className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1">
          📝 Forum Rules
        </h3>
        <ul className="text-xs text-stone-600 list-disc list-inside flex flex-col gap-1.5 leading-relaxed font-sans">
          <li>Gunakan bahasa yang sopan & jelas.</li>
          <li>Gunakan format markdown untuk kode program.</li>
          <li>Pastikan belum ada pertanyaan serupa sebelum posting.</li>
        </ul>
      </div>

      <div className="border border-stone-200 bg-white p-4 rounded shadow-xs">
        <h3 className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-3">
          🏷️ Hot Tags
        </h3>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag.id || tag.name}
                to={`/questions?filter=Newest&tag=${tag.name}`}
                className="bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60 rounded px-2 py-0.5 text-[11px] font-normal transition-colors font-sans flex items-center gap-1"
              >
                <span>{tag.name}</span>
                {tag.questionCount !== undefined && (
                  <span className="text-[9px] text-stone-400 font-mono font-medium">
                    ({tag.questionCount})
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[11px] italic text-stone-400 font-mono">
            [ Memuat daftar tag... ]
          </p>
        )}
      </div>
    </div>
  );
};
