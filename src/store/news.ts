import { dbService } from "@/db/indexedDB";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

export interface FormattedMultimediaProps {
  caption: string;
  copyright: string;
  [key: string]: string; // Индексная сигнатура для динамических полей
}

export function keepOnlyLetters(str: string) {
  return str.replace(/[^a-zA-Z]/g, "");
}

export function formatMultimedia(
  data: MultimediaProps[],
): FormattedMultimediaProps {
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
  published_date: Date;
  updated: Date;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: FormattedMultimediaProps;
}

export interface NewsStore {
  sections: Section[];
  selected_section: string;
  sectionsStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  sectionsError: string | null;

  current_news: NewsProps[];
  currentNewsStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  currentNewsError: string | null;

  // Actions
  initializeFromDB: (value?: string) => Promise<boolean>;
  getNewsData: (selected_section?: string) => Promise<void>;
  setSection: (selected_section: string) => void;
  reset: () => void;
}

const initialState = {
  sections: [],
  selected_section: "",
  sectionsStatus: null,
  sectionsError: null,
  current_news: [],
  currentNewsStatus: null,
  currentNewsError: null,
};

// Ключи для хранения в IndexedDB
const DB_KEYS = {
  NEWS_SECTIONS: "news_sections",
  NEWS_SECTION_PREFIX: "news_section_",
};

// Создаем store
export const useNewsStore = create<NewsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Функция для инициализации/загрузки данных из IndexedDB при старте
      initializeFromDB: async (value: string | undefined) => {
        try {
          let currentKey = DB_KEYS.NEWS_SECTIONS;
          if (value) {
            currentKey = DB_KEYS.NEWS_SECTION_PREFIX + value;
          }
          const stored = await dbService.load<NewsStore>(currentKey);

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
                sectionsStatus: "resolved",
              });
              return true;
            } else {
              // Данные устарели - удаляем их и будем загружать новые
              console.log(
                `🕒 Данные ${value ? `для секции "${value}"` : "секций"} устарели, загружаем новые...`,
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

      getNewsData: async (value?: string) => {
        const { initializeFromDB } = get();

        // Сначала пробуем загрузить из IndexedDB
        let loadedFromDB;
        if (value) {
          loadedFromDB = await initializeFromDB(value);
        } else {
          loadedFromDB = await initializeFromDB();
        }

        // Если данные загружены из DB и они свежие, не делаем запрос
        if (loadedFromDB) {
          console.log(
            `📦 Данные ${value ? `для секции "${value}"` : "секций"} загружены из IndexedDB`,
          );
          return;
        }

        // Устанавливаем соответствующий статус загрузки
        if (value) {
          set({ currentNewsStatus: "loading", currentNewsError: null });
        } else {
          set({ sectionsStatus: "loading", sectionsError: null });
        }

        const PATH = import.meta.env.VITE_NYT_NEWS;

        const url = value
          ? `/api/nyt${PATH}/all/${value}.json`
          : `/api/nyt${PATH}/section-list.json`;

        try {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(`SERVER ERROR! Status: ${res.status}`);
          }

          const data = await res.json();

          // Проверяем, что results существует и не null
          if (!data.results) {
            throw new Error(
              "The data was not received or has an incorrect format.",
            );
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
                  published_date: new Date(item.published_date),
                  updated: new Date(item.updated_date),
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
              current_news: formattedResults,
              currentNewsStatus: "resolved" as const,
            };

            set(newState);

            // Сохраняем в IndexedDB с ключом, включающим название секции
            await dbService.save(
              `${DB_KEYS.NEWS_SECTION_PREFIX}${value}`,
              newState,
              "news",
            );

            console.log(`💾 Данные секции "${value}" сохранены в IndexedDB`);
          } else {
            const arr = data.results.map((item: Section) => ({
              ...item,
              section: keepOnlyLetters(item.section),
            }));
            const newState = {
              sections: arr,
              sectionsStatus: "resolved" as const,
            };

            set(newState);

            // Сохраняем в IndexedDB
            await dbService.save(DB_KEYS.NEWS_SECTIONS, newState, "news");

            console.log("💾 Данные секций сохранены в IndexedDB");
          }
        } catch (error) {
          if (value) {
            set({
              currentNewsStatus: "rejected",
              currentNewsError: (error as Error).message,
              current_news: [],
            });
          } else {
            set({
              sectionsStatus: "rejected",
              sectionsError: (error as Error).message,
              sections: [],
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
    { name: "NewsStore" },
  ),
);
