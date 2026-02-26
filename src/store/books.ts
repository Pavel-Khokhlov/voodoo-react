import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Определяем типы (оставляем без изменений)
export interface List {
  userId: number;
  id: number;
  title: string;
  body: string;
  name?: string;
  [key: string]: any;
}

// Определяем интерфейс Store
interface BooksStore {
  bestsellers_date: string;
  lists: List[];
  next_published_date: string;
  previous_published_date: string;
  published_date: string;
  published_date_description: string;
  booksStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  booksError: string | null;

  // Actions
  getBooks: () => Promise<void>;
  searchAuthor: (searchTerm: string) => void;
  reset: () => void;
}

// Начальное состояние
const initialState = {
  bestsellers_date: "",
  lists: [],
  next_published_date: "",
  previous_published_date: "",
  published_date: "",
  published_date_description: "",
  booksStatus: null,
  booksError: null,
};

// Создаем store
export const useBooksStore = create<BooksStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      getBooks: async () => {
        set({ booksStatus: "loading", booksError: null });

        const API_KEY = import.meta.env.VITE_NYT_API_KEY;
        // const API_URL = import.meta.env.VITE_NYT_API_URL;
        const PATH = import.meta.env.VITE_NYT_ALL_BOOKS;

        const url = `/api/nyt${PATH}`;

        try {
          console.log("Request URL:", url);

          const res = await fetch(url);

          if (!res.ok) {
            throw new Error("SERVER ERROR!");
          }

          const data = await res.json();
          console.log("lists", data.results);

          set({
            lists: data.results.lists as List[],
            booksStatus: "resolved",
          });
        } catch (error) {
          set({
            booksStatus: "rejected",
            booksError: (error as Error).message,
          });
        }
      },

      /* searchAuthor: (searchTerm: string) => {
        const cleanSearchTerm = searchTerm
          .toLowerCase()
          .replace(/[.,!?%]/g, "");

        const filteredBooks = get().fullBooks.filter((book) =>
          book.name
            .toLowerCase()
            .replace(/[.,!?%]/g, "")
            .includes(cleanSearchTerm),
        );

        set({ filteredBooks });
      }, */

      reset: () => {
        set(initialState);
      },
    }),
    { name: "BooksStore" }, // имя для devtools
  ),
);

// Селекторы (опционально, для удобства)
export const useBooks = () => useBooksStore((state) => state.lists);
export const useBooksStatus = () => useBooksStore((state) => state.booksStatus);
export const useBooksError = () => useBooksStore((state) => state.booksError);
export const useBookActions = () =>
  useBooksStore((state) => ({
    getBooks: state.getBooks,
    searchAuthor: state.searchAuthor,
    reset: state.reset,
  }));
