import { useEffect, useState } from "react";
import {
  useLoaderData,
  useParams,
  useNavigate,
  useAsyncValue,
} from "react-router";
import type { LoaderFunction } from "react-router";
import { useWebSocket } from "../contexts/WebsocketContext";
import { api } from "../core/api";
import { Button } from "../components/Button";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";

// Import komponen-komponen hasil pemisahan
import { VotePanel } from "../components/VotePanel";
import { QuestionHeader } from "../components/QuestionHeader";
import { UserCard } from "../components/UserCard";
import { AnswerItem } from "../components/AnswerItem";
import { AnswerForm } from "../components/AnswerForm";

const getTagClassName = (tagName: string) => {
  return "bg-[#f2f0f0] text-[#0000008c] hover:bg-stone-200 border border-transparent rounded px-2 py-1 text-[11px] transition-colors";
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  try {
    const response = await api.get(`/api/questions/${id}`);
    return { data: response.data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error:
        err.response?.data?.message ||
        err.message ||
        "Gagal memuat detail diskusi.",
    };
  }
};

export const Component = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user: any = useAsyncValue();

  const loaderResult = useLoaderData() as { data: any; error: string | null };
  const [question, setQuestion] = useState<any>(loaderResult.data);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const { stompClient, isConnected } = useWebSocket();

  // Sinkronisasi data dari loader jika berubah
  useEffect(() => {
    if (loaderResult.data) {
      setQuestion(loaderResult.data);
    }
  }, [loaderResult.data]);

  // WebSocket Subscription
  useEffect(() => {
    if (!stompClient || !isConnected || !id) return;

    const detailSub = stompClient.subscribe(
      `/topic/questions/${id}`,
      (message) => {
        const updatedData = JSON.parse(message.body);
        setQuestion(updatedData);
      },
    );

    return () => {
      if (detailSub) detailSub.unsubscribe();
    };
  }, [stompClient, isConnected, id]);

  // Actions / Handlers
  const handleVoteAction = async (
    targetId: string,
    type: "QUESTION" | "ANSWER",
    direction: number,
  ) => {
    try {
      await api.post("/api/votes", {
        targetId,
        targetType: type,
        voteType: direction,
      });
    } catch (error: any) {
      toast.error(error.response?.data || "Gagal memproses vote.");
    }
  };

  const handleAcceptAnswerAction = async (answerId: string) => {
    try {
      await api.post(`/api/questions/${id}/accept/${answerId}`);
      toast.success("Jawaban terbaik berhasil disematkan!");
    } catch (error: any) {
      toast.error(error.response?.data || "Gagal memperbarui status jawaban.");
    }
  };

  const handleSubmitAnswerAction = async (
    content: string,
  ): Promise<boolean> => {
    try {
      setIsSubmittingAnswer(true);
      await api.post(`/api/answer/${id}`, { content });
      toast.success("Jawabanmu berhasil dikirim!");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data || "Gagal mengirimkan jawaban.");
      return false;
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Error boundary render
  if (loaderResult.error || !question || question.status) {
    return (
      <div className="p-12 text-center font-sans">
        <div className="inline-block bg-rose-50 border border-rose-200 text-rose-700 rounded-md p-6 max-w-lg">
          <h3 className="text-md font-bold mb-2">
            [!] Gagal Memuat Detail Pertanyaan
          </h3>
          <p className="text-xs text-rose-600 mb-4 font-mono">
            {loaderResult.error ||
              (question && JSON.stringify(question.message)) ||
              "ID Thread tidak valid atau telah dihapus."}
          </p>
          <Button size="sm" onClick={() => navigate("/questions")}>
            Kembali ke Forum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white antialiased min-h-screen">
      <QuestionHeader
        title={question.title}
        createdAt={question.createdAt}
        viewsCount={question.viewsCount}
        isConnected={isConnected}
      />

      <div className="flex px-4 items-start pb-6">
        <VotePanel
          targetId={question.id}
          type="QUESTION"
          votes={question.voteCount ?? 0}
          onVote={handleVoteAction}
        />

        <div className="min-w-0 flex-1">
          <div
            className="prose-sm max-w-none text-[15px] leading-relaxed mb-6"
            data-color-mode="light"
          >
            <MDEditor.Markdown
              source={question.description}
              className="text-sm!"
              style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent" }}
            />
          </div>

          <div className="flex flex-col mt-5 sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {question.tags?.map((tag: any) => (
                <span
                  key={tag.id || tag.name}
                  className={getTagClassName(tag.name)}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <UserCard
              label="asked"
              createdAt={question.createdAt}
              user={question.user}
              variant="question"
            />
          </div>
        </div>
      </div>

      <div className="mt-1">
        <h2 className="text-[19px] px-4 pb-2 text-stone-900">
          {question.answers?.length ?? 0} Answers
        </h2>

        {question.answers?.map((answer: any) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            currentUser={user}
            isCurrentAuthor={question.isCurrentAuthor}
            onVote={handleVoteAction}
            onAccept={handleAcceptAnswerAction}
            onEdit={(ansId) => navigate(`/answer/${ansId}/edit`)}
            onComment={() => {
              /* Handle comment */
            }}
          />
        ))}
      </div>
      <AnswerForm
        user={user}
        isSubmitting={isSubmittingAnswer}
        onSubmit={handleSubmitAnswerAction}
        onCancel={() => navigate("/questions")}
      />
    </div>
  );
};
