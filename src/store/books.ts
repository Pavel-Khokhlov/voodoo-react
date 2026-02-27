import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface BuyLink {
  name: string;
  url: string;
}

// Определяем интерфейс Book
export interface Book {
  age_group: string;
  amazon_product_url: string;
  article_chapter_link: string;
  asterisk: number;
  author: string;
  book_image: string;
  book_image_height: number;
  book_image_width: number;
  book_review_link: string;
  book_uri: string;
  buy_links: BuyLink[];
  contributor: string;
  contributor_note: string;
  created_date: string;
  dagger: number;
  description: string;
  first_chapter_link: string;
  isbns: Array<{ isbn10: string; isbn13: string }>;
  price: string;
  primary_isbn10: string;
  primary_isbn13: string;
  publisher: string;
  rank: number;
  rank_last_week: number;
  sunday_review_link: string;
  title: string;
  updated_date: string;
  weeks_on_list: number;
}

// Определяем интерфейс List
export interface List {
  books: Book[];
  corrections: any[];
  display_name: string;
  list_id: number;
  list_name: string;
  list_name_encoded: string;
  normal_list_ends_at: number;
  updated: string;
  uri: string;
}

// Определяем интерфейс Store
interface BooksStore {
  bestsellers_date: string;
  lists: List[];
  next_published_date: string;
  previous_published_date: string;
  published_date: string;
  published_date_description: string;
  selected_list: string;
  booksStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  booksError: string | null;

  // Actions
  getLists: () => Promise<void>;
  setList: (selected_list: string) => void;
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
  selected_list: "",
  booksStatus: null,
  booksError: null,
};

// Создаем store
export const useBooksStore = create<BooksStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      getLists: async () => {
        set({ booksStatus: "loading", booksError: null });

        const PATH =
          import.meta.env.VITE_NYT_ALL_BOOKS || "/lists/overview.json";
        const url = `/api/nyt${PATH}`;

        try {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error("SERVER ERROR!");
          }

          const data = await res.json();

          set({
            lists: data.results.lists as List[],
            bestsellers_date: data.results.bestsellers_date,
            next_published_date: data.results.next_published_date,
            previous_published_date: data.results.previous_published_date,
            published_date: data.results.published_date,
            published_date_description: data.results.published_date_description,
            booksStatus: "resolved",
          });
        } catch (error) {
          set({
            booksStatus: "rejected",
            booksError: (error as Error).message,
          });
        }
      },

      setList: (value: string) => {
        set({ selected_list: value });
      },

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
export const useSelectedList = () =>
  useBooksStore((state) => state.selected_list);
export const useSetSelectedList = () => useBooksStore((state) => state.setList);

export const useBookActions = () =>
  useBooksStore((state) => ({
    getList: state.getLists,
    searchAuthor: state.searchAuthor,
    reset: state.reset,
  }));
