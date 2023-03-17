import './table.scss';

import axios from 'axios';
import React, { useEffect } from 'react';

import Button from '../../components/elements/Button/Button';
import TableRow from './tableRow';

const Table = (): JSX.Element => {
  const loadData = async () => {
    const res: { data: [] } = await axios.request({
      method: 'get',
      url: 'https://cloud.iexapis.com/stable/tops?token=sk_0e70f3df5e7d472693e28f2c04b0e8cc',
    });
    const { data } = res;
    console.log(data);
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="table__container">
      <table className={`table`}>
        <TableRow>
          <th className={`row__element`}>Имя пользователя</th>
          <th className={`row__element`}>E-mail</th>
          <th className={`row__element`}>Дата регистрации</th>
          <th className={`row__element`}>Рейтинг</th>
          <th className={`row__element`}></th>
        </TableRow>
      </table>
      <div className={`pagination`}>
        <Button
          onClick={() => {
            console.log('PREV');
          }}
        >
          Prev
        </Button>
        <div>{123}</div>
        <Button
          onClick={() => {
            console.log('NEXT');
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Table;
