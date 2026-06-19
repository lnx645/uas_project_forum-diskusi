import { formatReputation, formatTimeAgo } from "../core/formatter";

interface UserCardProps {
  label: string;
  createdAt: string;
  user: {
    name?: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  variant?: "question" | "answer";
}

export const UserCard = ({
  label,
  createdAt,
  user,
  variant = "question",
}: UserCardProps) => {
  const isQuestion = variant === "question";

  return (
    <div
      className={`ml-auto rounded py-2 px-3 w-52 text-[12px] ${
        isQuestion ? "bg-sky-50/50 border border-sky-100" : ""
      }`}
    >
      <div className="text-stone-400 text-[11px] mb-1.5">
        {label} {formatTimeAgo(createdAt)}
      </div>
      <div className="flex items-center gap-2">
        {user?.avatar ? (
          <img src={user.avatar} className="h-6 w-6 shrink-0" alt="" />
        ) : (
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-semibold uppercase ${
              isQuestion
                ? "bg-orange-200 text-orange-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {user?.username?.charAt(0) || "U"}
          </div>
        )}
        <div className="leading-tight min-w-0">
          <span
            className={`font-medium block truncate ${
              isQuestion ? "text-sky-700" : "text-blue-500 underline"
            }`}
          >
            {isQuestion
              ? user?.username || "anonymous"
              : `${user?.name || "anonymous"}@(${user?.username})`}
          </span>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {formatReputation(user?.reputation || 0)} rep
          </div>
        </div>
      </div>
    </div>
  );
};
