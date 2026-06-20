import MDEditor from "@uiw/react-md-editor";
import { VotePanel } from "./VotePanel";
import { UserCard } from "./UserCard";

interface AnswerItemProps {
  answer: any;
  currentUser: any;
  isCurrentAuthor: boolean;
  onVote: (targetId: string, type: "QUESTION" | "ANSWER", direction: number) => void;
  onAccept: (answerId: string) => void;
  onEdit: (answerId: string) => void;
  onComment: () => void;
  // Tambahkan properti opsional onDelete di interface props
  onDelete?: (answerId: string) => void; 
}

export const AnswerItem = ({
  answer,
  currentUser,
  isCurrentAuthor,
  onVote,
  onAccept,
  onEdit,
  onComment,
  onDelete, // Destructure dari props
}: AnswerItemProps) => {
  const isAccepted = !!answer?.accepted;

  return (
    <div
      className={`flex px-3 items-start py-5 border-b border-stone-100 transition-colors ${
        isAccepted ? "bg-emerald-200/20 border-l-4 border-y-none border-l-emerald-500 px-2" : ""
      }`}
    >
      <VotePanel
        targetId={answer.id}
        type="ANSWER"
        votes={answer.voteCount ?? 0}
        onVote={onVote}
        isAccepted={isAccepted}
        isCurrentAuthor={isCurrentAuthor}
        onAccept={onAccept}
      />

      <div className="min-w-0 ml-2 flex-1">
        <div className="prose-sm max-w-none text-[14.5px] leading-relaxed" data-color-mode="light">
          <MDEditor.Markdown
            source={answer.content}
            className="text-[13px]! text-black!"
            style={{ whiteSpace: "pre-wrap", backgroundColor: "transparent" }}
          />
        </div>
        
        <div className="flex mt-3 items-start justify-between">
          <div className="flex items-center mt-2 text-stone-500 gap-1">
            {/* Cek jika user login adalah pemilik jawaban untuk aksi Edit & Delete */}
            {currentUser && currentUser.id === answer?.user?.id && (
              <>
                <button onClick={() => onEdit(answer.id)} className="text-xs underline cursor-pointer p-1 hover:text-stone-800">
                  Edit
                </button>
                {onDelete && (
                  <button 
                    onClick={() => onDelete(answer.id)} 
                    className="text-xs underline cursor-pointer p-1 text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
            
            <button onClick={onComment} className="text-xs underline cursor-pointer p-1 hover:text-stone-800">
              Comment
            </button>
          </div>
          
          <div className="flex justify-end">
            <UserCard
              label="answered"
              createdAt={answer.createdAt}
              user={answer.user}
              variant="answer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};