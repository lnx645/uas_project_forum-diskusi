import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useLocation } from "react-router";
import type { LoaderFunction } from "react-router";
import { Button } from "../components/Button";
import { useWebSocket } from "../contexts/WebsocketContext";
import { api } from "../core/api";
import { formatReputation, formatTimeAgo } from "../core/formatter";

const filters = ["Newest", "Active", "Trending", "Featured"];

const getTagClassName = (tagName: string) => {
  return "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-transparent rounded px-2 py-1 text-[11px] font-normal transition-colors font-sans";
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "0";
  const filter = url.searchParams.get("filter") || "Newest";
  const tag = url.searchParams.get("tag") || "";

  try {
    const response = await api.get(`/api/questions?page=${page}&size=10&filter=${filter}&tag=${tag}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { content: [], totalPages: 0, totalElements: 0, currentPage: 0 };
  }
};

export const Component = () => {
  const pagedData = useLoaderData() as any; 
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const activeFilter = searchParams.get("filter") || "Newest";
  const currentPage = parseInt(searchParams.get("page") || "0", 10);

  const [questions, setQuestions] = useState<any[]>(pagedData?.content || []);
  const { stompClient, isConnected } = useWebSocket();
  useEffect(() => {
    if (pagedData?.content) {
      setQuestions(pagedData.content);
    }
  }, [pagedData]);

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const questionSub = stompClient.subscribe("/topic/questions", (message) => {
      const newQuestion = JSON.parse(message.body);
      setQuestions((prev) => {
        if (prev.some((q) => q.id === newQuestion.id)) return prev;
        return [newQuestion, ...prev];
      });
    });

    return () => {
      if (questionSub) questionSub.unsubscribe();
    };
  }, [stompClient, isConnected]);

  const handleFilterChange = (selectedFilter: string) => {
    navigate(`?page=0&filter=${selectedFilter}`);
  };
  const handlePageChange = (targetPage: number) => {
    if (targetPage < 0 || targetPage >= pagedData.totalPages) return;
    navigate(`?page=${targetPage}&filter=${activeFilter}`);
  };

  return (
    <div className="bg-white antialiased min-h-screen text-stone-800 font-sans">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-normal tracking-tight text-stone-900">
            Recently Active Questions
          </h1>

          <div className="ml-auto">
            <Button size="sm" onClick={() => navigate("/questions/create")}>
              Ask Question
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-center">
          <p className="text-[15px] text-stone-600">
            {pagedData?.totalElements || 0} questions
          </p>

          <div className="ml-auto flex overflow-hidden rounded-md border border-stone-300 bg-white">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`border-r border-stone-300 px-3 py-1 text-xs leading-none transition-colors last:border-r-0 cursor-pointer
                  ${
                    filter === activeFilter
                      ? "bg-stone-100 font-medium text-stone-900"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-1 bg-stone-50/50 flex justify-end border-b border-stone-200">
        <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-wider text-stone-400 uppercase">
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-400"}`}></span>
          {isConnected ? "Live Network Connected" : "Live Network Offline"}
        </span>
      </div>

      <div className="border-t border-stone-200">
        {questions && questions.length > 0 ? (
          questions.map((question) => {
            const hasAnswers = (question.answerCount ?? 0) > 0;
            
            return (
              <article
                key={question.id}
                className="lg:flex gap-6 border-b border-stone-200 px-6 py-5 transition-colors hover:bg-stone-50/40"
              >
                <div className="lg:w-24 flex flex-row items-center lg:flex-col gap-4 lg:gap-0 lg:items-end shrink-0 text-[13px] leading-5 text-stone-500 font-sans">
                  <div className={Number(question.voteCount) < 0 ? "text-red-600 font-medium" : "text-stone-700"}>
                    {question.voteCount ?? 0} votes
                  </div>

                  <div
                    className={`my-1 py-0.5 text-center text-[13px] rounded ${
                      hasAnswers
                        ? "border border-emerald-600 text-emerald-700 font-medium"
                        : "text-stone-500"
                    }`}
                  >
                    {question?.answers?.length ?? 0} answers
                  </div>

                  <div className="text-stone-400">
                    {question.viewsCount ?? 0} views
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    onClick={() => navigate(`/questions/${question.id}`)}
                    className="cursor-pointer text-[17px] leading-[1.35] text-sky-700 hover:text-sky-800 break-words font-normal"
                  >
                    {question.title}
                  </h2>

                  <p className="mt-2 text-[13px] text-stone-600 line-clamp-2 leading-relaxed break-words">
                    {question.description}
                  </p>

                  <div className="mt-3 flex items-end">
                    <div className="flex flex-wrap gap-1.5">
                      {question.tags && question.tags.length > 0 ? (
                        question.tags.map((tag: any) => (
                          <span key={tag.id || tag.name} className={getTagClassName(tag.name)}>
                            {tag.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] italic text-stone-400">[no-category]</span>
                      )}
                    </div>

                    <div className="ml-auto flex items-center gap-2 text-[12px] text-stone-500">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-200 text-xs font-semibold text-orange-800 uppercase">
                        {question.user?.username?.charAt(0) || "U"}
                      </div>

                      <div className="leading-tight">
                        <div>
                          asked {formatTimeAgo(question?.createdAt)} by{" "}
                          <span className="cursor-pointer font-medium text-sky-700 hover:underline">
                            {question.user?.username || "anonymous"}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-stone-400 mt-0.5">
                          {formatReputation(question.user?.reputation || 0)} reputation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-16 text-center text-xs text-stone-400 bg-stone-50/50">
            [!] Belum ada riwayat pertanyaan yang dikirimkan ke papan forum ini.
          </div>
        )}
      </div>

      {pagedData && pagedData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 py-8 border-t border-stone-100 bg-stone-50/30">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Prev
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: pagedData.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`px-3 py-1.5 border rounded text-xs font-medium transition-colors cursor-pointer ${
                  currentPage === idx
                    ? "bg-stone-900 border-stone-900 text-white font-semibold"
                    : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagedData.totalPages - 1}
            className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};