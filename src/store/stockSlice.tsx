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
      state.stockList = newStockList;
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
      state.stockListPage = state.stockList.slice((newPage - 1) * 10, (newPage - 1) * 10 + 10);
    },
    reorderStockList(state, action) {
      // Reorder page stock list
      const newList: IStock[] = action.payload;
      state.stockListPage = newList;
      // Data reoreder persistance
      const page = state.page;
      const stockSlistPre = state.stockList.slice(0, (page - 1) * 10);
      const stockListPost = state.stockList.slice((page - 1) * 10 + 10, state.stockList.length);
      const newStockList: IStock[] = stockSlistPre.concat(newList, stockListPost);
      state.stockList = newStockList;
    },
  },
});

export default stockSlice;
