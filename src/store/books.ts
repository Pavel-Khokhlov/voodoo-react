import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Определяем типы (оставляем без изменений)
export interface Book {
  userId: number;
  id: number;
  title: string;
  body: string;
  name?: string;
  [key: string]: any;
}

export interface FullBook extends Book {
  name: string;
}

// Определяем интерфейс Store
interface BooksStore {
  // State
  books: Book[];
  fullBooks: FullBook[];
  filteredBooks: FullBook[];
  booksStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  booksError: string | null;

  // Actions
  getBooks: () => Promise<void>;
  searchAuthor: (searchTerm: string) => void;
  initialBooks: () => void;
  reset: () => void;
}

// Начальное состояние
const initialState = {
  books: [],
  fullBooks: [],
  filteredBooks: [],
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
        const API_URL = import.meta.env.VITE_NYT_API_URL;
        const PATH = import.meta.env.VITE_NYT_ALL_BOOKS;

        const url = `/api/nyt${PATH}?api-key=${API_KEY}`;

        try {
          console.log("Request URL:", url);

          const res = await fetch(url);

          if (!res.ok) {
            throw new Error("SERVER ERROR!");
          }

          const data = await res.json();
          console.log("books", data.results.lists);

          set({
            books: data.results as Book[],
            booksStatus: "resolved",
          });
        } catch (error) {
          set({
            booksStatus: "rejected",
            booksError: (error as Error).message,
          });
        }
      },

      searchAuthor: (searchTerm: string) => {
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
      },

      initialBooks: () => {
        set({ filteredBooks: get().fullBooks });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: "BooksStore" }, // имя для devtools
  ),
);

// Селекторы (опционально, для удобства)
export const useBooks = () => useBooksStore((state) => state.books);
export const useFullBooks = () => useBooksStore((state) => state.fullBooks);
export const useFilteredBooks = () =>
  useBooksStore((state) => state.filteredBooks);
export const useBooksStatus = () => useBooksStore((state) => state.booksStatus);
export const useBooksError = () => useBooksStore((state) => state.booksError);
export const useBookActions = () =>
  useBooksStore((state) => ({
    getBooks: state.getBooks,
    searchAuthor: state.searchAuthor,
    initialBooks: state.initialBooks,
    reset: state.reset,
  }));
