import { dbService } from "@/db/indexedDB";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const TopSections = [
  "arts",
  "automobiles",
  "books",
  "business",
  "fashion",
  "food",
  "health",
  "home",
  "insider",
  "magazine",
  "movies",
  "nyregion",
  "obituaries",
  "opinion",
  "politics",
  "realestate",
  "science",
  "sports",
  "sundayreview",
  "technology",
  "theater",
  "t-magazine",
  "travel",
  "upshot",
  "us",
  "world",
];

export interface MultimediaProps {
  url: string;
  format: string;
  height: number;
  width: number;
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
}

interface FormattedMultimediaProps {
  caption: string;
  copyright: string;
  [key: string]: string; // Индексная сигнатура для динамических полей
}

function keepOnlyLetters(str: string) {
  return str.replace(/[^a-zA-Z]/g, "");
}

function formatMultimedia(data: MultimediaProps[]): FormattedMultimediaProps {
  // Защита от undefined или пустого массива
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      caption: "",
      copyright: "",
      url1: "", // Добавляем пустой url по умолчанию
    };
  }

  const firstItem = data[0];

  const result = {
    caption: firstItem.caption,
    copyright: firstItem.copyright,
  };

  const urlsObject = data.reduce((acc, item, index) => {
    return {
      ...acc,
      [`url${index + 1}`]: item.url,
    };
  }, {});

  return Object.assign(result, urlsObject) as {
    caption: string;
    copyright: string;
    [key: `url${number}`]: string;
  };
}

export interface Section {
  section: string;
  display_name: string;
}

export interface NewsProps {
  section: string;
  title: string;
  abstract: string;
  uri: string;
  url: string;
  byline: string;
  source: string;
  published_date: string;
  material_type_facet: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: FormattedMultimediaProps;
}

export interface TopStoriesStore {
  selected_section: string;
  topStories: NewsProps[];
  topStoriesStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  topStoriesError: string | null;

  // Actions
  initializeFromDB: (value?: string) => Promise<boolean>;
  getTopStoriesData: (selected_section?: string) => Promise<void>;
  setSection: (selected_section: string) => void;
  reset: () => void;
}

const initialState = {
  selected_section: "",
  topStories: [],
  topStoriesStatus: null,
  topStoriesError: null,
};

// Ключи для хранения в IndexedDB
const DB_KEYS = {
  TOP_STORIES_PREFIX: "top_stories_",
};

// Создаем store
export const useTopStoriesStore = create<TopStoriesStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Функция для инициализации/загрузки данных из IndexedDB при старте
      initializeFromDB: async (value: string | undefined) => {
        try {
          let currentKey = DB_KEYS.TOP_STORIES_PREFIX + value;
          const stored = await dbService.load<TopStoriesStore>(currentKey);

          if (stored) {
            // Проверяем свежесть данных (1 час = 3600000 мс)
            const MAX_AGE_HOUR = 5 * 60 * 1000;
            const isFresh = dbService.isDataFresh(
              stored.timestamp,
              MAX_AGE_HOUR,
            );

            if (isFresh) {
              // Данные свежие - восстанавливаем состояние
              set({
                ...stored.data,
                topStoriesStatus: "resolved",
              });
              return true;
            } else {
              // Данные устарели - удаляем их и будем загружать новые
              console.log(
                `🕒 Данные для секции "${value}" устарели, загружаем новые...`,
              );
              await dbService.delete(currentKey);
              return false;
            }
          }
          return false;
        } catch (error) {
          console.error("Ошибка инициализации из DB:", error);
          return false;
        }
      },

      getTopStoriesData: async (value?: string) => {
        if (!value) return;
        const { initializeFromDB } = get();

        // Сначала пробуем загрузить из IndexedDB
        let loadedFromDB;
        if (value) {
          loadedFromDB = await initializeFromDB(value);
        }

        // Если данные загружены из DB и они свежие, не делаем запрос
        if (loadedFromDB) {
          console.log(`📦 Данные для секции "${value}" загружены из IndexedDB`);
          return;
        }

        // Устанавливаем соответствующий статус загрузки
        if (value) {
          set({ topStoriesStatus: "loading", topStoriesError: null });
        }

        const PATH = import.meta.env.VITE_NYT_TOP_STORIES;

        const url = `/api/nyt${PATH}/${value}.json`;

        try {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(`SERVER ERROR! Status: ${res.status}`);
          }

          const data = await res.json();
          console.log("WHATS THE DATA", data);

          // Проверяем, что results существует и не null
          if (!data.results) {
            throw new Error("Данные не получены или имеют неверный формат");
          }

          if (value) {
            const formattedResults = data.results
              .map(
                (item: any): NewsProps => ({
                  section: item.section,
                  title: item.title,
                  abstract: item.abstract,
                  uri: item.uri,
                  url: item.url,
                  byline: item.byline,
                  source: item.source,
                  published_date: item.published_date,
                  material_type_facet: item.material_type_facet,
                  des_facet: item.des_facet,
                  org_facet: item.org_facet,
                  per_facet: item.per_facet,
                  geo_facet: item.geo_facet,
                  multimedia: formatMultimedia(item.multimedia),
                }),
              )
              .filter((item: any) => {
                const hasMultimediaUrls = Object.keys(item.multimedia).some(
                  (key) => key.startsWith("url") && item.multimedia[key],
                );

                return item.title?.trim() && item.url && hasMultimediaUrls;
              });

            // Сохраняем данные конкретной секции
            const newState = {
              topStories: formattedResults.sort((a: NewsProps, b: NewsProps) =>
                b.published_date.localeCompare(a.published_date),
              ),
              topStoriesStatus: "resolved" as const,
            };

            set(newState);

            // Сохраняем в IndexedDB с ключом, включающим название секции
            await dbService.save(
              `${DB_KEYS.TOP_STORIES_PREFIX}${value}`,
              newState,
              "top_stories",
            );

            console.log(`💾 Данные секции "${value}" сохранены в IndexedDB`);
          }
        } catch (error) {
          if (value) {
            set({
              topStoriesStatus: "rejected",
              topStoriesError: (error as Error).message,
              // Очищаем данные при ошибке
              topStories: [],
            });
          }
        }
      },

      setSection: (selected_section: string) => {
        set({ selected_section });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: "TopStoriesStore" },
  ),
);
