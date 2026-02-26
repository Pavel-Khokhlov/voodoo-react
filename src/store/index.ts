import { useBooksStore } from './books';
import { useGlobalUIStore } from './globalUI';

export const useStore = () => {
  return {
    booksStore: useBooksStore(),
    globalUIStore: useGlobalUIStore(),
  };
};