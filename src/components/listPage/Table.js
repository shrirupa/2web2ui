import React from 'react';
import propTypes from 'prop-types';
import { TableCollection } from 'src/components';

const Table = ({
  columns,
  items,
  filterBox,
  defaultSortColumn,
  actionProps,
  children
}) => {
  const filterBoxOptions = filterBox
    ? { show: true, ...filterBox }
    : { show: false };
  return (
    <TableCollection
      columns={columns}
      getRowData={(row) =>
        children({ row, columns, actionProps: { item: row, ...actionProps }})
      }
      pagination={true}
      rows={items}
      filterBox={filterBoxOptions}
      defaultSortColumn={defaultSortColumn || columns[0]}
    />
  );
};

Table.displayName = 'ListPage.Table';

Table.propTypes = {
  children: propTypes.func.isRequired
};

Table.defaultProps = {
  children: ({ row, columns }) => [
    ...columns.map(({ sortKey }) => row[sortKey])
  ]
};

export default Table;
