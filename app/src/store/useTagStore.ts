import { create } from "zustand";

interface Tag {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

interface TagStore {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  
  setTags: (tags) => set({ tags }),
  
  addTag: (newTag) => set((state) => {
    if (state.tags.some((t) => t.id === newTag.id)) return state;
    return { tags: [newTag, ...state.tags] };
  }),
}));