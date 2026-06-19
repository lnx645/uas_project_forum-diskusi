import { useEffect, useState } from "react";
import {
  useLoaderData,
  useParams,
  useNavigate,
  useAsyncValue,
} from "react-router";
import type { LoaderFunction } from "react-router";
import { api } from "../core/api";
import { Button } from "../components/Button";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";

export const loader: LoaderFunction = async ({ params }) => {
  const { id: answerId } = params;

  try {
    const response = await api.get(`/api/answer/${answerId}`);
    return { data: response.data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error:
        err.response?.data?.message ||
        err.message ||
        "Gagal memuat data jawaban.",
    };
  }
};

export const Component = () => {
  const {id: answerId } = useParams();
  const navigate = useNavigate();
  const user: any = useAsyncValue();

  const loaderResult = useLoaderData() as { data: any; error: string | null };
  const [content, setContent] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loaderResult.data?.content) {
      setContent(loaderResult.data.content);
    }
  }, [loaderResult.data]);

  useEffect(() => {
    if (loaderResult.data && user) {
      if (loaderResult.data.user?.id !== user.id) {
        toast.error("Kamu tidak memiliki akses untuk mengedit jawaban ini.");
        navigate(-1);
      }
    }
  }, [loaderResult.data, user, navigate]);

  if (loaderResult.error || !loaderResult.data) {
    return (
      <div className="p-12 text-center font-sans">
        <div className="inline-block bg-rose-50 border border-rose-200 text-rose-700 rounded-md p-6 max-w-lg">
          <h3 className="text-md font-bold mb-2">[!] Gagal Memuat Jawaban</h3>
          <p className="text-xs text-rose-600 mb-4 font-mono">
            {loaderResult.error ||
              "Jawaban tidak ditemukan atau telah dihapus."}
          </p>
          <Button size="sm" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content?.trim()) {
      toast.error("Konten jawaban tidak boleh kosong!");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/api/answer/${answerId}`, {
        content: content.trim(),
      });

      toast.success("Jawaban berhasil diperbarui!");
      if (loaderResult.data.questionId) {
        navigate(`/questions/${loaderResult.data.questionId}`);
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Gagal memperbarui jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white antialiased min-h-screen p-6">
      <div className="max-w-3xl mx-auto border border-stone-200 rounded-lg p-6 bg-stone-50/30">
        <div className="border-b border-stone-200 pb-4 mb-6">
          <h1 className="text-[22px] font-semibold tracking-tight leading-tight text-stone-900">
            Edit Your Answer
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Perbaiki kesalahan ketik, perjelas kode, atau perbarui solusi
            teknismu.
          </p>
        </div>

        <form onSubmit={handleSubmit} data-color-mode="light">
          <div className="mb-6">
            <MDEditor
              value={content}
              onChange={setContent}
              height={350}
              preview="edit"
              textareaProps={{
                placeholder: "Perbarui kontribusi solusi teknismu di sini...",
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content?.trim()}
            >
              {isSubmitting ? "Saving Changes..." : "Save Edits"}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
