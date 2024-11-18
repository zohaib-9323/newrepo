import { configureStore } from "@reduxjs/toolkit";
import { authapiSlice } from "../api/EmptySplit"

export const store = configureStore({
    reducer:{
        [authapiSlice.reducerPath]:authapiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          authapiSlice.middleware,
        ),
});

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;