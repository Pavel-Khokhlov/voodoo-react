import { useGlobalUIStore } from './globalUI';
import { useNewsStore } from './news';
import { useTopStoriesStore } from './top-stories';
import { useMostPopularStore } from './most_popular';
import { useBooksStore } from './books';

export const useStore = () => {
  return {
    globalUIStore: useGlobalUIStore(),
    newsStore: useNewsStore(),
    topStoriesStore: useTopStoriesStore(),
    mostPopularStore: useMostPopularStore(),
    booksStore: useBooksStore(),
  };
};