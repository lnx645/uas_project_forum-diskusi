import { FaAngleDown, FaAngleUp, FaCheckDouble } from "react-icons/fa6";

interface VotePanelProps {
  targetId: string;
  type: "QUESTION" | "ANSWER";
  votes: number;
  onVote: (
    targetId: string,
    type: "QUESTION" | "ANSWER",
    direction: number,
  ) => void;
  isAccepted?: boolean;
  isCurrentAuthor?: boolean;
  onAccept?: (answerId: string) => void;
}

export const VotePanel = ({
  targetId,
  type,
  votes,
  onVote,
  isAccepted,
  isCurrentAuthor,
  onAccept,
}: VotePanelProps) => {
  return (
    <div className="w-12 shrink-0 flex flex-col items-center text-stone-500">
      {/* Tombol Upvote */}
      <button
        onClick={() => onVote(targetId, type, 1)}
        className="text-stone-400 hover:text-sky-600 text-2xl font-bold cursor-pointer transition-colors leading-none"
      >
        <FaAngleUp />
      </button>

      {/* Counter Jumlah Vote */}
      <div className="text-stone-700 font-semibold text-base my-0.5">
        {votes}
      </div>

      {/* Tombol Downvote */}
      <button
        onClick={() => onVote(targetId, type, -1)}
        className="text-stone-400 hover:text-rose-600 text-2xl font-bold cursor-pointer transition-colors leading-none"
      >
        <FaAngleDown />
      </button>

      {/* Indikator / Tombol Solusi Terbaik (Accepted Answer) */}
      <>
        {isAccepted ? (
          <div
            className="mt-3 rounded-2xl text-emerald-600 text-2xl font-bold"
            title="Jawaban terbaik pilihan TS"
          >
            <FaCheckDouble size={14} />
          </div>
        ) : (
          isCurrentAuthor &&
          onAccept && (
            <button
              onClick={() => onAccept(targetId)}
              className="mt-3 text-stone-300 hover:text-emerald-500 text-xl cursor-pointer opacity-40 hover:opacity-100 transition-all"
              title="Tandai sebagai jawaban terbaik"
            >
              ✔
            </button>
          )
        )}
      </>
    </div>
  );
};
