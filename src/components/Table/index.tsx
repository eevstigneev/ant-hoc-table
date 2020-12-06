import React, {FC, ReactElement, useMemo} from 'react';
import {Table as AntTable} from 'antd';
import {TableProps} from 'antd/lib/table';
import styled from '@emotion/styled';
import {mergeTableParts, TWithTable} from './HOC/helpers';
import {TCell, THeaderCell} from './TableParts';
import * as TableHOCS from './HOC';

const TableBox = styled.section`
  margin: 30px 0;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 12px 18px 0 rgba(0, 0, 0, 0.15);
`;

const styledComponents = {
  header: {
    cell: THeaderCell,
  },
  body: {
    cell: TCell,
  },
};

type TOptions = {
  withDeletableRows?: boolean;
  withEditableCells?: boolean;
  withDraggableSortRows?: boolean;
  withLinkToDetail?: boolean;
  withSearchByTitle?: boolean;
  withAddableRows?: boolean;
  withReSyncKey?: boolean;
};

const Table = <TRecord extends Record<string, unknown>>(
  props: TableProps<TRecord>,
): ReactElement<TableProps<TRecord>> => {
  const {components, ...restProps} = props;
  const mergedComponents = useMemo(() => mergeTableParts(styledComponents, components), [components]);
  return (
    <TableBox>
      <AntTable<TRecord> rowKey="index" components={mergedComponents} {...restProps} />
    </TableBox>
  );
};
Table.displayName = 'Table';

export function withTable<TRecord extends Record<string, unknown>>(options: TOptions): FC<TWithTable<TRecord>> {
  const enhancesKeys = Object.entries(options);
  const enhances = (enhancesKeys || [])
    .map(([optName, optValue]) => {
      if (!optValue || !(optName in TableHOCS) || typeof TableHOCS[optName] !== 'function') {
        return null;
      }
      return TableHOCS[optName];
    })
    .filter(Boolean);

  return React.memo(enhances.reduce((Wrapped, Wrapper) => Wrapper(Wrapped), Table));
}

export default Table;
