import { useGlobalUIStore } from './globalUI';
import { useNewsStore } from './news';
import { useBooksStore } from './books';

export const useStore = () => {
  return {
    globalUIStore: useGlobalUIStore(),
    newsStore: useNewsStore(),
    booksStore: useBooksStore(),
  };
};