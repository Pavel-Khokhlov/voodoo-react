import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Category =
  | "books"
  | "news"
  | "mostpopular"
  | "topstories"
  | "search"
  | "";

// Определяем интерфейс Store
interface GlobalUIStore {
  category: Category;

  setCategory: (category: GlobalUIStore["category"]) => void;
  reset: () => void;
}

// Начальное состояние
const initialState = {
  category: "" as Category,
};

// Создаем store
export const useGlobalUIStore = create<GlobalUIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Добавленный метод для установки категории
      setCategory: (category) => {
        set({ category });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: "GlobalUIStore" }, // имя для devtools
  ),
);

// Селекторы (опционально, для удобства)
export const useCategory = () => useGlobalUIStore((state) => state.category);
export const useSetCategory = () =>
  useGlobalUIStore((state) => state.setCategory);
