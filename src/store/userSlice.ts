/* import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    // You can add regular reducers here if needed
  },
  // FIXED: Changed from object notation to builder callback
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.usersStatus = "resolved";
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.usersStatus = "rejected";
        state.usersError = action.payload;
      });
  },
});

// You can export actions here if you add any regular reducers
export const { } = userSlice.actions;

export default userSlice.reducer; */