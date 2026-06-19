import { formatTimeAgo } from "../core/formatter";

interface QuestionHeaderProps {
  title: string;
  createdAt: string;
  viewsCount: number;
  isConnected: boolean;
}

export const QuestionHeader = ({
  title,
  createdAt,
  viewsCount,
  isConnected,
}: QuestionHeaderProps) => {
  return (
    <div className="border-b p-6 border-[#f2f0f0] pb-4 mb-6">
      <h1 className="text-[19px] font-medium lg:text-[22px] text-[#1f1f1f]  tracking-tight leading-tight wrap-break-word">
        {title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-stone-500">
        <div>
          <span className="text-[#444746]">Asked</span> {formatTimeAgo(createdAt)}
        </div>
        <div>
          <span className="text-[#444746]">Viewed</span> {viewsCount ?? 0} times
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? "bg-emerald-500" : "bg-rose-400"
            }`}
          ></span>
          <span className="text-[10px] font-mono text-[#444746] uppercase">
            Live Context
          </span>
        </div>
      </div>
    </div>
  );
};