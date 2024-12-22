// store.ts
import { create } from "zustand";
import { Article } from "./interfaces";
import { get } from "./api";

export interface GlobalState {
  // global states
  selectedArticle: Article | null;
  data: Article[] | null;

  // global state setters
  setSelectedArticle: (id: Article | null) => void;
  setData: (data: Article[] | null) => void;

  fetchData: () => Promise<void>;
}

export const useStore = create<GlobalState>((set) => ({
  // global states
  selectedArticle: null,
  data: null,

  // gloabl state setters
  setSelectedArticle: (article: Article | null) =>
    set({ selectedArticle: article }),
  setData: (data: Article[] | null) => set({ data }),

  fetchData: async () => {
    try {
      const json = await get({ route: "/data" });
      set((state) => {
        // only set if new data
        if (JSON.stringify(state.data) === JSON.stringify(json)) {
          return state;
        }
        return { data: json };
      });
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  },
}));
