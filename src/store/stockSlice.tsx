import { createSlice } from '@reduxjs/toolkit';

import type { IStock } from '../types/interfaces';

interface StockSchema {
  dataLoading: boolean;
  stockList: IStock[];
  stockListLoaded: boolean;
  page: number;
  maxPage: number;
  pagesArray: number[];
  stockListPage: IStock[];
}

const initialStockState: StockSchema = {
  dataLoading: false,
  stockList: [],
  stockListLoaded: false,
  page: 1,
  maxPage: 1,
  pagesArray: [1],
  stockListPage: [],
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState: initialStockState,
  reducers: {
    setDataLoading(state, action) {
      state.dataLoading = action.payload;
    },
    setStockList(state, action) {
      const newStockList: IStock[] = action.payload;
      state.stockList = action.payload;
      state.stockListLoaded = true;
      state.maxPage = Math.ceil(newStockList.length / 10);
      state.stockListPage = newStockList.slice(0, 10);
      const pagesArray: number[] = [];
      for (let i = 1; i <= state.maxPage; i++) {
        pagesArray.push(i);
      }
      state.pagesArray = pagesArray;
    },
    setPage(state, action) {
      const newPage: number = action.payload;
      state.page = newPage;
      state.stockListPage = state.stockList.slice(newPage * 10 - 1, newPage * 10 - 1 + 10);
    },
    reorderStockList(state, action) {
      const newList: IStock[] = action.payload;
      state.stockListPage = newList;
    },
  },
});

export default stockSlice;
