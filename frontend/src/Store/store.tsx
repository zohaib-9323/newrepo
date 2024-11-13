import { configureStore } from "@reduxjs/toolkit";
import { authapiSlice } from "../Services/auth"
import { courseapiSlice } from "../Services/courseapi";
import { configure } from "@testing-library/react";

export const store = configureStore({
    reducer:{
        [authapiSlice.reducerPath]:authapiSlice.reducer,
        [courseapiSlice.reducerPath]:courseapiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          authapiSlice.middleware,
          courseapiSlice.middleware
        ),
});

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;