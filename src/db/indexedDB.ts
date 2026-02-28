// src/lib/indexedDB.ts

export interface StoredData<T = any> {
  data: T;
  timestamp: number;
  type: "books" | "news" | "other";
}

export interface DBOptions {
  dbName?: string;
  version?: number;
}

class IndexedDBService {
  private dbName: string;
  private version: number;
  private storeName: string = "app-store";

  constructor(options: DBOptions = {}) {
    this.dbName = options.dbName || "app-database";
    this.version = options.version || 1;
  }

  // Открыть соединение с БД
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Создаем хранилище, если его нет
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName);

          // Создаем индексы для удобного поиска
          store.createIndex("type", "type", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  // Сохранить данные
  async save<T>(
    key: string,
    data: T,
    type: "books" | "news" | "other" = "other",
  ): Promise<void> {
    try {
      const db = await this.openDB();

      const storedData: StoredData<T> = {
        data,
        timestamp: Date.now(),
        type,
      };

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.put(storedData, key);

        request.onsuccess = () => {
          tx.commit();
          resolve();
        };
        request.onerror = () => reject(request.error);

        tx.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error(`Ошибка сохранения в IndexedDB (${key}):`, error);
      throw error;
    }
  }

  // Загрузить данные
  async load<T>(key: string): Promise<StoredData<T> | null> {
    try {
      const db = await this.openDB();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result || null);
          db.close();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Ошибка загрузки из IndexedDB (${key}):`, error);
      return null;
    }
  }

  // Удалить данные
  async delete(key: string): Promise<void> {
    try {
      const db = await this.openDB();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          tx.commit();
          resolve();
        };
        request.onerror = () => reject(request.error);

        tx.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error(`Ошибка удаления из IndexedDB (${key}):`, error);
    }
  }

  // Очистить все данные определенного типа
  async clearByType(type: "books" | "news" | "other"): Promise<void> {
    try {
      const db = await this.openDB();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const index = store.index("type");
        const request = index.openCursor(IDBKeyRange.only(type));

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);

        tx.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error(`Ошибка очистки типа ${type}:`, error);
    }
  }

  // Получить все ключи
  async getAllKeys(): Promise<string[]> {
    try {
      const db = await this.openDB();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => {
          resolve(request.result as string[]);
          db.close();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Ошибка получения ключей:", error);
      return [];
    }
  }

  // Проверить свежесть данных
  isDataFresh(
    lastUpdate: number | null,
    maxAgeMs: number = 24 * 60 * 60 * 1000,
  ): boolean {
    if (!lastUpdate) return false;
    return Date.now() - lastUpdate < maxAgeMs;
  }
}

// Создаем и экспортируем singleton инстанс
export const dbService = new IndexedDBService();

// Также экспортируем класс для возможности создания отдельных инстансов
export default IndexedDBService;
