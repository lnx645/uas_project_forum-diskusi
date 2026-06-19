import { useState } from "react";
import { useNavigate } from "react-router";
import type { LoaderFunction } from "react-router";
import { Button } from "../components/Button";
import { useTagStore } from "../store/useTagStore";
import { api } from "../core/api";
import { toast } from "sonner";

// 1. IMPORT COMPONENT & CSS MD-EDITOR
import MDEditor from "@uiw/react-md-editor";
import { Input } from "../components/Input";

export const loader: LoaderFunction = async () => {
  return null;
};

export const Component = () => {
  const navigate = useNavigate();
  const { tags } = useTagStore();

  const [title, setTitle] = useState("");

  // State content menampung raw markdown text dari editor
  const [content, setContent] = useState<string | undefined>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tagName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(tagName)
        ? prev.filter((name) => name !== tagName)
        : [...prev, tagName],
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
        content: content.trim(), // String markdown dikirim ke Spring Boot
        tags: selectedCategories,
      });

      toast.success("Pertanyaan berhasil diterbitkan!");
      navigate("/questions");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(
          "Sesi login kamu habis atau tidak valid. Silakan login kembali.",
        );
      } else {
        toast.error(error.response?.data || "Gagal menerbitkan pertanyaan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white antialiased min-h-screen text-stone-800 font-sans p-6">
      <div className="border-b border-stone-200  pb-4 mb-6">
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
            <p className="text-xs text-stone-500 mb-2">
              Jelaskan masalahmu. Kamu bisa menggunakan tombol toolbar untuk
              menyisipkan cuplikan kode, format tebal, atau kutipan.
            </p>
            <MDEditor
              value={content}
              onChange={setContent}
              height={300}
              preview="edit"
              textareaProps={{
                placeholder:
                  "Gunakan triple backtick (```) untuk menulis blok kode program...",
              }}
            />
          </div>

          <div>
            <label className="block text-[15px] font-medium text-stone-900 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 border border-stone-300 rounded-md max-h-40 overflow-y-auto">
              {tags && tags.length > 0 ? (
                tags.map((tag) => {
                  const isSelected = selectedCategories.includes(tag.name);
                  return (
                    <button
                      key={tag.id || tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-2 py-1 text-[11px] rounded border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-sky-600 border-sky-700 text-white font-medium"
                          : "bg-white border-stone-300 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {isSelected ? `✓ ${tag.name}` : `+ ${tag.name}`}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs italic text-stone-400 font-mono">
                  [!] Memori tag kosong.
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
