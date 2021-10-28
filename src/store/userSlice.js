import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, PATH_USERS } from "../utils/config";

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(API + PATH_USERS, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("SERVER ERROR!");
      }
      const users = await response.json();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  usersStatus: null,
  usersError: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.usersStatus = "loading";
      state.usersError = null;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.usersStatus = "resolved";
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.usersStatus = "rejected";
      state.usersError = action.payload;
    },
  },
});

export const { } = userSlice.actions;

export default userSlice.reducer;
