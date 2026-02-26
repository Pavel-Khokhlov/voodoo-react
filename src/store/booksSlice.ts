import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определяем типы
export interface Book {
  userId: number;
  id: number;
  title: string;
  body: string;
  // Добавьте другие поля, которые приходят с API
  name?: string; // Добавляем опциональное поле name (появляется после concatArr)
  [key: string]: any; // Для других динамических полей
}


export interface FullBook extends Book {
  name: string; // После объединения name становится обязательным
  // другие поля от пользователя
}

interface BookState {
  books: Book[];
  fullBooks: FullBook[];
  filteredBooks: FullBook[];
  booksStatus: 'idle' | 'loading' | 'resolved' | 'rejected' | null;
  booksError: string | null;
}

const initialState: BookState = {
  books: [],
  fullBooks: [],
  filteredBooks: [],
  booksStatus: null,
  booksError: null,
};

// Типизируем thunk
export const getBooks = createAsyncThunk<
  Book[], // Return type
  void, // First argument type
  { rejectValue: string } // ThunkApi config
>(
  "post/getPosts",
  async function (_, { rejectWithValue }) {
    const API_KEY = import.meta.env.VITE_NYT_API_KEY;
    const API_URL = import.meta.env.VITE_NYT_API_URL;
    const PATH = import.meta.env.VITE_NYT_ALL_BOOKS;
    
    const url = `/api/nyt${PATH}?api-key=${API_KEY}`;
    
    try {
      console.log('Request URL:', url);

      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error("SERVER ERROR!");
      }
      
      const data = await res.json();
      console.log('books', data.results.lists);
      
      return data.results as Book[]; // Возвращаем посты
      
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    initialBooks(state) {
      state.filteredBooks = state.fullBooks;
    },
    searchAuthor(state, action: PayloadAction<string>) {
      const searchTerm = action.payload.toLowerCase().replace(/[.,!?%]/g, "");
      
      const filteredBooks = state.fullBooks.filter((book) =>
        book.name
          .toLowerCase()
          .replace(/[.,!?%]/g, "")
          .includes(searchTerm)
      );
      
      state.filteredBooks = filteredBooks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.booksStatus = "loading";
        state.booksError = null;
      })
      .addCase(getBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.booksStatus = "resolved";
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.booksStatus = "rejected";
        state.booksError = action.payload ?? 'Unknown error';
      });
  },
});

export const { searchAuthor, initialBooks } = booksSlice.actions;

export default booksSlice.reducer;
