import './table.scss';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/elements/Button/Button';
import Spinner from '../../components/elements/Spinner/Spinner';
import useWindowSize from '../../hooks/useWindowSize';
import type { RootState } from '../../store/store';
import { stockActions } from '../../store/store';
import type { IStock } from '../../types/interfaces';

const stockKeyValues = {
  symbol: 'Stock Symbol',
  askPrice: 'Ask Price',
  askSize: 'Ask Size',
  bidPrice: 'Bid Price',
  bidSize: 'Bid Size',
  lastSalePrice: 'Last Sale Price',
  lastSaleSize: 'Last Sale Size',
  lastSaleTime: 'Last Sale Time',
  lastUpdated: 'Last Updated',
  sector: 'Sector',
  securityType: 'Security Type',
  volume: 'Volume',
};

// !!!!!!!!!!! Add your own iexcloud.io token here !!!!!!!!!!!!!!!!!!
const token = '';

const Table = (): JSX.Element => {
  // Custom hook to check window size
  const { width } = useWindowSize();
  // State
  const dispatch = useDispatch();
  const dataLoading = useSelector<RootState, boolean>((state) => state.stockSlice.dataLoading);
  const stockListLoaded = useSelector<RootState, boolean>((state) => state.stockSlice.stockListLoaded);
  const stockListPage = useSelector<RootState, IStock[]>((state) => state.stockSlice.stockListPage);
  const page = useSelector<RootState, number>((state) => state.stockSlice.page);
  const maxPage = useSelector<RootState, number>((state) => state.stockSlice.maxPage);
  const pagesArray = useSelector<RootState, number[]>((state) => state.stockSlice.pagesArray);
  // Navigate page
  const navigatePage = (newPage: number) => {
    if (newPage > 0 && newPage <= maxPage) {
      dispatch(stockActions.setPage(newPage));
    }
  };
  // Field selection
  const [field, setField] = useState('askPrice');
  const fieldChange = (newField: string) => {
    setField(newField);
  };
  // Drag and drop functionality
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(stockListPage);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(stockActions.reorderStockList(items));
  };
  // Load data
  const loadData = async () => {
    try {
      dispatch(stockActions.setDataLoading(true));
      const res: { data: IStock[] } = await axios.request({
        method: 'get',
        url: `https://cloud.iexapis.com/stable/tops?token=${token}`,
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
    }
  }, [stockListLoaded]);
  return (
    <>
      {dataLoading ? (
        <Spinner height="100vh" />
      ) : (
        <div className="table__container">
          {/*Static table head */}
          <table className={`table`}>
            <thead className={`table__head`}>
              <tr className="table__row">
                <th key={'No.'} className={`row__element`}>
                  No.
                </th>
                <th key={'Symbol'} className={`row__element`}>
                  Stock Symbol
                </th>
                {/*Select field if screen is less than 1000px */}
                {(width || 1000) < 1000 ? (
                  <th className={`row__element`}>
                    <select
                      className="select"
                      value={field}
                      onChange={(e: any) => {
                        fieldChange(e.target.value);
                      }}
                    >
                      {Object.entries(stockKeyValues).map((entry) => {
                        return entry[1] !== 'Stock Symbol' ? (
                          <option key={entry[0]} value={entry[0]}>
                            {entry[1]}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </th>
                ) : (
                  <>
                    {Object.values(stockKeyValues).map((header) => {
                      return header !== 'Stock Symbol' ? (
                        <th key={header} className={`row__element`}>
                          {header}
                        </th>
                      ) : null;
                    })}
                  </>
                )}
              </tr>
            </thead>
            {/*Table body. Can be dragged and dropped */}
            <tbody className={`table__body`}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {stockListPage.map((stock: IStock, index: number) => (
                        <Draggable key={stock.symbol} draggableId={stock.symbol.toString()} index={index}>
                          {(provided) => (
                            <tr
                              className="table__row"
                              key={stock.symbol}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <td key={'No.'} className={`row__element`}>
                                {(page - 1) * 10 + (index + 1)}
                              </td>
                              <td key="symbol" className={`row__element`}>
                                {stock.symbol}
                              </td>
                              {/*Select field if screen is less than 1000px */}
                              {(width || 1000) < 1000 ? (
                                <td key={field} className={`row__element`}>
                                  {stock[field as keyof IStock]}
                                </td>
                              ) : (
                                <>
                                  {Object.keys(stockKeyValues).map((dataKey: string) => {
                                    if (dataKey === 'lastSaleTime' || dataKey === 'lastUpdated') {
                                      return (
                                        <td key={dataKey} className={`row__element`}>
                                          {new Date(stock[dataKey]).toLocaleTimeString()}
                                        </td>
                                      );
                                    } else {
                                      return dataKey !== 'symbol' ? (
                                        <td key={dataKey} className={`row__element`}>
                                          {stock[dataKey as keyof IStock]}
                                        </td>
                                      ) : null;
                                    }
                                  })}
                                </>
                              )}
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
            {/* Current page , total pages, and page selection */}
            <div className="pages">
              <span>Page</span>
              <select
                className="select"
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
