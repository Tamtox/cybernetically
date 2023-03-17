interface IStock {
  askPrice: number;
  askSIze: number;
  bidPrice: number;
  bidSize: number;
  lastSalePrice: number;
  lastSaleSize: number;
  lastSaleTime: number;
  lastUpdated: number;
  sector: string;
  securityType: string;
  symbol: string;
  volume: number;
}

export type { IStock };
