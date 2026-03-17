import { useGlobalUIStore } from './globalUI';
import { useNewsStore } from './news';
import { useTopStoriesStore } from './top-stories';
import { useBooksStore } from './books';

export const useStore = () => {
  return {
    globalUIStore: useGlobalUIStore(),
    newsStore: useNewsStore(),
    topStoriesStore: useTopStoriesStore(),
    booksStore: useBooksStore(),
  };
};