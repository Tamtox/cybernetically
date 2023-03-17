import './table.scss';

import axios from 'axios';
import { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/elements/Button/Button';
import Spinner from '../../components/elements/Spinner/Spinner';
import type { RootState } from '../../store/store';
import { stockActions } from '../../store/store';
import type { IStock } from '../../types/interfaces';

const tableHeaders = [
  'No',
  'Stock Symbol',
  'Ask Price',
  'Ask Size',
  'Bid Size',
  'Bid Price',
  'Last Sale Price',
  'Last Sale Size',
  'Last Sale Time',
  'Last Updated',
  'Sector',
  'Security Type',
  'Volume',
];

const tableDataKeys = [
  'symbol',
  'askPrice',
  'askSize',
  'bidPrice',
  'bidSize',
  'lastSalePrice',
  'lastSaleSize',
  'lastSaleTime',
  'lastUpdated',
  'sector',
  'securityType',
  'volume',
];

// iexcloud.io token
const token = 'sk_0e70f3df5e7d472693e28f2c04b0e8cc';

const Table = (): JSX.Element => {
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
  // Load data
  const loadData = async () => {
    try {
      dispatch(stockActions.setDataLoading(true));
      const res: { data: IStock[] } = await axios.request({
        method: 'get',
        url: `https://cloud.iexapis.com/stable/tops?token=${token}`,
      });
      const { data } = res;
      console.log(data);
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
  // Drag and drop functionality
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(stockListPage);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(stockActions.reorderStockList(items));
  };
  return (
    <>
      {dataLoading ? (
        <Spinner height="100vh" />
      ) : (
        <div className="table__container">
          <table className={`table`}>
            <thead className={`table__head`}>
              <tr className="table__row">
                {tableHeaders.map((header) => {
                  return (
                    <th key={header} className={`row__element`}>
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
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
                              <td className={`row__element`}>{(page - 1) * 10 + (index + 1)}</td>
                              {tableDataKeys.map((dataKey: string) => {
                                if (dataKey === 'lastSaleTime' || dataKey === 'lastUpdated') {
                                  return (
                                    <td key={dataKey} className={`row__element`}>
                                      {new Date(stock[dataKey]).toLocaleTimeString()}
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td key={dataKey} className={`row__element`}>
                                      {stock[dataKey as keyof IStock]}
                                    </td>
                                  );
                                }
                              })}
                              {/* <td className={`row__element`}>{stock.symbol}</td>
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
                              <td className={`row__element`}>{stock.volume}</td> */}
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
