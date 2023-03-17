import { createSlice } from '@reduxjs/toolkit';

import type { IStock } from '../types/interfaces';

interface StockSchema {
  dataLoading: boolean;
  stockList: IStock[];
  page: number;
}

const initialStockState: StockSchema = {
  dataLoading: false,
  stockList: [],
  page: 1,
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState: initialStockState,
  reducers: {},
});

export default stockSlice;
