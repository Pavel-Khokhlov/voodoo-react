import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./userSlice";
import postReduser from "./postSlice";

export default configureStore({
  reducer: {
    user: userReduser,
    post: postReduser,
  },
});
