import './table.scss';

import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/elements/Button/Button';
import Spinner from '../../components/elements/Spinner/Spinner';
import type { RootState } from '../../store/store';
import { stockActions } from '../../store/store';
import type { IStock } from '../../types/interfaces';
import TableRow from './tableRow';

const Table = (): JSX.Element => {
  // State
  const dispatch = useDispatch();
  const dataLoading = useSelector<RootState, boolean>((state) => state.stockSlice.dataLoading);
  const stockListLoaded = useSelector<RootState, boolean>((state) => state.stockSlice.stockListLoaded);
  const stockListPage = useSelector<RootState, IStock[]>((state) => state.stockSlice.stockListPage);
  const page = useSelector<RootState, number>((state) => state.stockSlice.page);
  const maxPage = useSelector<RootState, number>((state) => state.stockSlice.maxPage);
  const pagesArray = useSelector<RootState, number[]>((state) => state.stockSlice.pagesArray);
  console.log(stockListPage, page);
  // Navigate page
  const navigatePage = (newPage: number) => {
    if (newPage > 0 && newPage <= maxPage) {
      dispatch(stockActions.setPage(newPage));
    }
  };
  // Load data
  const loadData = async () => {
    try {
      dispatch(stockActions.setDataLoading(true));
      const res: { data: IStock[] } = await axios.request({
        method: 'get',
        url: 'https://cloud.iexapis.com/stable/tops?token=sk_0e70f3df5e7d472693e28f2c04b0e8cc',
      });
      const { data } = res;
      dispatch(stockActions.setStockList(data));
    } catch (error) {
      axios.isAxiosError(error) ? alert(error.response?.data || error.message) : console.log(error);
    } finally {
      dispatch(stockActions.setDataLoading(false));
    }
  };
  useEffect(() => {
    if (!stockListLoaded) {
      loadData();
      console.log(123);
    }
  }, [stockListLoaded]);
  return (
    <>
      {dataLoading ? (
        <Spinner height="100vh" />
      ) : (
        <div className="table__container">
          <table className={`table`}>
            <thead className={`table__head`}>
              <TableRow>
                <th className={`row__element`}>No.</th>
                <th className={`row__element`}>Stock Symbol</th>
                <th className={`row__element`}>Ask Price</th>
                <th className={`row__element`}>Ask Size</th>
                <th className={`row__element`}>Bid Size</th>
                <th className={`row__element`}>Bid Price</th>
                <th className={`row__element`}>Last Sale Price</th>
                <th className={`row__element`}>Last Sale Size</th>
                <th className={`row__element`}>Last Sale Time</th>
                <th className={`row__element`}>Last Updated</th>
                <th className={`row__element`}>Sector</th>
                <th className={`row__element`}>Security Type</th>
                <th className={`row__element`}>Volume</th>
              </TableRow>
            </thead>
            <tbody className={`table__body`}>
              {stockListPage.map((stock: IStock, index: number) => {
                return (
                  <TableRow key={stock.symbol}>
                    <td className={`row__element`}>{(page - 1) * 10 + (index + 1)}</td>
                    <td className={`row__element`}>{stock.symbol}</td>
                    <td className={`row__element`}>{stock.askPrice}</td>
                    <td className={`row__element`}>{stock.askSize}</td>
                    <td className={`row__element`}>{stock.bidPrice}</td>
                    <td className={`row__element`}>{stock.bidSize}</td>
                    <td className={`row__element`}>{stock.lastSalePrice}</td>
                    <td className={`row__element`}>{stock.lastSaleSize}</td>
                    <td className={`row__element`}>{new Date(stock.lastSaleTime).toLocaleTimeString()}</td>
                    <td className={`row__element`}>{new Date(stock.lastUpdated).toLocaleTimeString()}</td>
                    <td className={`row__element`}>{stock.sector}</td>
                    <td className={`row__element`}>{stock.securityType}</td>
                    <td className={`row__element`}>{stock.volume}</td>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
          <div className={`pagination`}>
            <Button
              onClick={() => {
                navigatePage(Number(page - 1));
              }}
            >
              Prev
            </Button>
            <div className="pages">
              <span>Page</span>
              <select
                name="page"
                value={page}
                onChange={(e: any) => {
                  navigatePage(Number(e.target.value));
                }}
              >
                {pagesArray.map((page: number) => {
                  return <option key={page}>{page}</option>;
                })}
              </select>
              <span>{` of ${maxPage}`}</span>
            </div>
            <Button
              onClick={() => {
                navigatePage(Number(page + 1));
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
