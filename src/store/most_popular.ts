import { dbService } from "@/db/indexedDB";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { NewsProps, FormattedMultimediaProps } from "./news";

export const Popular_Type = [
  { value: "emailed", label: "Get most emailed articles" },
  { value: "shared", label: "Get most shared articles" },
  { value: "viewed", label: "Get most viewed articles" },
];

export const Popular_Period = [
  { value: "1", label: "For the last day" },
  { value: "7", label: "For the last seven days" },
  { value: "30", label: "For the last thirty days" },
];

interface MediaProps {
  format: string;
  height: number;
  url: string;
  width: number;
}

export interface PopularMultimediaProps {
  approved_for_syndication: number;
  caption: string;
  copyright: string;
  "media-metadata": MediaProps[];
  subtype: string;
  type: string;
}

export function formatPopularMultimedia(data: any[]): FormattedMultimediaProps {
  const result: FormattedMultimediaProps = {
    caption: "",
    copyright: "",
    url1: "",
  };

  // Проверяем, есть ли элементы в массиве media
  if (data && data.length > 0) {
    const mediaItem = data[0]; // Берем первый элемент

    result.caption = mediaItem.caption || "";
    result.copyright = mediaItem.copyright || "";

    // Проверяем наличие media-metadata
    if (
      mediaItem["media-metadata"] &&
      Array.isArray(mediaItem["media-metadata"])
    ) {
      mediaItem["media-metadata"].forEach(
        (media: MediaProps, index: number) => {
          result[`url${index + 1}`] = media.url || "";
        },
      );
    }
  }

  return result;
}

export interface MostPopularStore {
  mostPopular: NewsProps[];
  mostPopularStatus: "idle" | "loading" | "resolved" | "rejected" | null;
  mostPopularError: string | null;

  // Actions
  initializeFromDB: (type: string, period: string) => Promise<boolean>;
  getMostPopularData: (type: string, period: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  mostPopular: [],
  mostPopularStatus: null,
  mostPopularError: null,
};

// Ключи для хранения в IndexedDB
const DB_KEYS = {
  MOST_POPULAR_PREFIX: "most_popular_",
};

// Создаем store
export const useMostPopularStore = create<MostPopularStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Функция для инициализации/загрузки данных из IndexedDB при старте
      initializeFromDB: async (type: string, period: string) => {
        try {
          let currentKey = DB_KEYS.MOST_POPULAR_PREFIX + type + period;
          const stored = await dbService.load<MostPopularStore>(currentKey);

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
                mostPopularStatus: "resolved",
              });
              return true;
            } else {
              // Данные устарели - удаляем их и будем загружать новые
              console.log(
                `🕒 Данные типа "${type}" за период "${period}" устарели, загружаем новые...`,
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

      getMostPopularData: async (type: string, period: string) => {
        if (!type && !period) return;
        const { initializeFromDB } = get();

        // Сначала пробуем загрузить из IndexedDB
        let loadedFromDB;
        if (type && period) {
          loadedFromDB = await initializeFromDB(type, period);
        }

        // Если данные загружены из DB и они свежие, не делаем запрос
        if (loadedFromDB) {
          console.log(
            `📦 Данные типа "${type}" за период "${period}" загружены из IndexedDB`,
          );
          return;
        }

        // Устанавливаем соответствующий статус загрузки
        if (type && period) {
          set({ mostPopularStatus: "loading", mostPopularError: null });
        }

        const PATH = import.meta.env.VITE_NYT_MOST_POPULAR;

        const url = `/api/nyt${PATH}/${type}/${period}.json`;

        try {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(`SERVER ERROR! Status: ${res.status}`);
          }

          const data = await res.json();

          // Проверяем, что results существует и не null
          if (!data.results) {
            throw new Error("The data was not received or has an incorrect format.");
          }

          if (type && period) {
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
                  updated: new Date(item.updated),
                  des_facet: item.des_facet,
                  org_facet: item.org_facet,
                  per_facet: item.per_facet,
                  geo_facet: item.geo_facet,
                  multimedia: formatPopularMultimedia(item.media),
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
              mostPopular: formattedResults.sort(
                (a: NewsProps, b: NewsProps) =>
                  b.updated.getTime() - a.updated.getTime(),
              ),
              mostPopularStatus: "resolved" as const,
            };

            set(newState);

            // Сохраняем в IndexedDB с ключом, включающим название секции
            await dbService.save(
              `${DB_KEYS.MOST_POPULAR_PREFIX}${type}${period}`,
              newState,
              "most_popular",
            );

            console.log(
              `💾 Данные типа "${type}" за период "${period}" сохранены в IndexedDB`,
            );
          }
        } catch (error) {
          if (type && period) {
            set({
              mostPopularStatus: "rejected",
              mostPopularError: (error as Error).message,
              mostPopular: [],
            });
          }
        }
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: "MostPopularStore" },
  ),
);
