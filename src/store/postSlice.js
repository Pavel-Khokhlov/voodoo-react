import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LIMIT, API, PATH_POSTS } from "../utils/config";

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(API + PATH_POSTS + LIMIT, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("SERVER ERROR!");
      }
      const posts = await response.json();
      return posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  fullPosts: [],
  postsStatus: null,
  postsError: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    concatArr(status, action) {
      const newPosts = status.posts.map((post) =>
        Object.assign(
          post,
          action.payload.find((user) => post.id === user.id)
        )
      );
      status.fullPosts = newPosts;
    },
    searchAuthor(state, action) {
      let filteredPosts = [];
      filteredPosts = state.fullPosts.filter((post) =>
        post.name
          .toLowerCase()
          .replace(/[.,!?%]/g, "")
          .includes(action.payload.toLowerCase())
      );
      state.fullPosts = filteredPosts;
    },
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.postsStatus = "loading";
      state.postsError = null;
    },
    [getPosts.fulfilled]: (state, action) => {
      state.postsStatus = "resolved";
      state.posts = action.payload;
    },
    [getPosts.rejected]: (state, action) => {
      state.postsStatus = "rejected";
      state.postsError = action.payload;
    },
  },
});

export const { concatArr, searchAuthor } = postSlice.actions;

export default postSlice.reducer;
