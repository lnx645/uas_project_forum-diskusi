import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import type { LoaderFunction } from "react-router";
import { Button } from "../components/Button";
import { api } from "../core/api";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "../components/Input";

interface TagResponse {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

export const loader: LoaderFunction = async () => {
  try {
    const response = await api.get("/api/tags");
    return { storeTags: response.data as TagResponse[], error: null };
  } catch (err: any) {
    console.error("Gagal memuat rekomendasi tag:", err);
    return { storeTags: [], error: "Gagal mengambil daftar tag populer." };
  }
};

export const Component = () => {
  const navigate = useNavigate();
  const { storeTags } = useLoaderData() as {
    storeTags: TagResponse[];
    error: string | null;
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleTagToggle = (tagName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(tagName)
        ? prev.filter((name) => name !== tagName)
        : [...prev, tagName],
    );
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const trimmedTag = tagInput.trim().toLowerCase();
      if (!trimmedTag) return;

      if (selectedCategories.includes(trimmedTag)) {
        toast.error("Tag sudah dipilih!");
        return;
      }

      setSelectedCategories((prev) => [...prev, trimmedTag]);
      setTagInput("");
    }
  };

  const removeSelectedTag = (tagNameToRemove: string) => {
    setSelectedCategories((prev) =>
      prev.filter((name) => name !== tagNameToRemove),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content?.trim() || selectedCategories.length === 0) {
      toast.error(
        "Wajib mengisi Judul, Detail Pertanyaan, dan minimal satu Tag!",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/api/questions", {
        title: title.trim(),
        content: content.trim(),
        tags: selectedCategories,
      });

      toast.success("Pertanyaan berhasil diterbitkan!");
      navigate("/questions");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Gagal menerbitkan pertanyaan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white antialiased min-h-screen text-stone-800 font-sans p-6">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h1 className="text-[24px] font-normal tracking-tight text-stone-900">
          Ask a Public Question
        </h1>
      </div>

      <div className="max-w-3xl border border-stone-300 rounded-md p-6 bg-white shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[15px] font-medium text-stone-900 mb-1">
              Title
            </label>
            <Input
              type="text"
              placeholder="e.g. How do I autowire a bean conditionally in Spring Boot?"
              value={title}
              inputSize="sm"
              onChange={(e) => setTitle(e.target.value)}
              className="py-2"
            />
          </div>

          <div data-color-mode="light">
            <label className="block text-[15px] font-medium text-stone-900 mb-1">
              What are the details of your problem?
            </label>
            <MDEditor
              value={content}
              onChange={setContent}
              height={300}
              preview="edit"
            />
          </div>
          <div>
            <label className="block text-[15px] font-medium text-stone-900 mb-1">
              Tags
            </label>

            <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50/50 border border-stone-200 rounded-md min-h-10.5 items-center mb-3">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((tagName) => (
                  <span
                    key={tagName}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-medium shadow-2xs"
                  >
                    #{tagName}
                    <button
                      type="button"
                      onClick={() => removeSelectedTag(tagName)}
                      className="text-sky-500 hover:text-sky-800 font-bold focus:outline-none cursor-pointer text-xs"
                    >
                      &times;
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-stone-400 pl-1">
                  Belum ada tag terpilih...
                </span>
              )}

              <input
                type="text"
                placeholder="Ketik tag kustom & tekan enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleCustomTagKeyDown}
                className="flex-1 min-w-37.5 bg-transparent border-none text-[11px] text-stone-800 focus:outline-none focus:ring-0 p-0.5 ml-1"
              />
            </div>

            <p className="text-[11px] text-stone-500 mb-1.5 font-medium">
              Rekomendasi tag populer dari sistem:
            </p>
            <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-stone-300 rounded-md max-h-32 overflow-y-auto shadow-inner">
              {storeTags && storeTags.length > 0 ? (
                storeTags.map((tag) => {
                  const isSelected = selectedCategories.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      title={tag.description} 
                      className={`px-2 py-1 text-[11px] rounded border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-sky-600 border-sky-700 text-white font-medium shadow-xs"
                          : "bg-stone-50 border-stone-300 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {isSelected ? `✓ ${tag.name}` : `+ ${tag.name}`}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs italic text-stone-400 font-mono">
                  [!] Tidak ada rekomendasi tag dari server.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex gap-3">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Post Your Question"}
            </Button>
            <button
              type="button"
              onClick={() => navigate("/questions")}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
