import './tableRow.scss';

const TableRow = (props: any): JSX.Element => {
  return <tr className={`table__row`}>{props.children}</tr>;
};

export default TableRow;
