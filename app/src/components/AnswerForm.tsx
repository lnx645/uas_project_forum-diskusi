import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./Button";
import { LoginActionInfoBanner } from "./LoginActionInfoBanner";

interface AnswerFormProps {
  user: any;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<boolean>;
  onCancel: () => void;
}

export const AnswerForm = ({ user, isSubmitting, onSubmit, onCancel }: AnswerFormProps) => {
  const [newAnswer, setNewAnswer] = useState<string | undefined>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer?.trim()) return;

    const success = await onSubmit(newAnswer.trim());
    if (success) {
      setNewAnswer("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 px-6 mb-4 max-w-3xl" data-color-mode="light">
      <h3 className="text-[17px] mb-3 text-stone-900">Your Answer</h3>
      <div className="mb-4">
        {user ? (
          <MDEditor
            value={newAnswer}
            onChange={setNewAnswer}
            height={200}
            preview="edit"
            textareaProps={{
              placeholder: "Tuliskan kontribusi solusi teknismu di sini...",
            }}
          />
        ) : (
          <LoginActionInfoBanner />
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <Button type="submit" size="sm" disabled={isSubmitting || !newAnswer?.trim()}>
            {isSubmitting ? "Submitting..." : "Post Your Answer"}
          </Button>
        ) : (
          <i className="text-xs">Login Dulu yaa!!</i>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};