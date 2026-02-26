import { useBooksStore } from './books';

export const useStore = () => {
  return {
    booksStore: useBooksStore(),
  };
};