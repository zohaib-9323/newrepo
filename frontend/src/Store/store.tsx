import { configureStore } from "@reduxjs/toolkit";
import { authapiSlice } from "../Services/auth"
import { courseapiSlice } from "../Services/courseapi";
import { studentapiSlice } from "../Services/studentapi";
import { teacherapiSlice } from "../Services/teacherapi";
import { configure } from "@testing-library/react";

export const store = configureStore({
    reducer:{
        [authapiSlice.reducerPath]:authapiSlice.reducer,
        [courseapiSlice.reducerPath]:courseapiSlice.reducer,
        [studentapiSlice.reducerPath]: studentapiSlice.reducer,
        [teacherapiSlice.reducerPath]: teacherapiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          authapiSlice.middleware,
          courseapiSlice.middleware,
          studentapiSlice.middleware,
          teacherapiSlice.middleware,
        ),
});

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;