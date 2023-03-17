import { configureStore } from '@reduxjs/toolkit';

import stockSlice from './stockSlice';

const store = configureStore({
  reducer: {
    stockSlice: stockSlice.reducer,
  },
});

export const dataActions = stockSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
