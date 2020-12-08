import React, {FC, ReactElement, useMemo} from 'react';
import {Table as AntTable} from 'antd';
import {TableProps} from 'antd/lib/table';
import {mergeTableParts} from './HOC/helpers';
import {TableWrapper, TableCell, TableHeadCell} from './TableParts';

const styledComponents = {
  header: {
    cell: TableHeadCell,
  },
  body: {
    cell: TableCell,
  },
};

const Table: FC = <TRecord extends Record<string, unknown>>(
  props: TableProps<TRecord>,
): ReactElement<TableProps<TRecord>> => {
  const {components, ...restProps} = props;
  const mergedComponents = useMemo(() => mergeTableParts(styledComponents, components), [components]);
  return (
    <TableWrapper>
      <AntTable<TRecord> components={mergedComponents} {...restProps} />
    </TableWrapper>
  );
};

Table.defaultProps = {
  rowKey: 'index',
};

export default Table;
