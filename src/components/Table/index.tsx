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

const Table: FC = <TRecord extends Record<string, unknown>>(
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

type TOptions = {
  withDeletableRows?: boolean;
  withEditableCells?: boolean;
  withDraggableSortRows?: boolean;
  withLinkToDetail?: boolean;
  withSearchByTitle?: boolean;
  withAddableRows?: boolean;
  withReSyncKey?: boolean;
};

export function withTable<TRecord extends Record<string, unknown>>(options: TOptions): FC<TWithTable<TRecord>> {
  if (!options || !Object.values(options).length) {
    return Table;
  }
  const enhances = [];

  if (options.withDraggableSortRows) enhances.push(TableHOCS.withDraggableSortRows);
  if (options.withSearchByTitle) enhances.push(TableHOCS.withSearchByTitle);
  if (options.withAddableRows) enhances.push(TableHOCS.withAddableRows);
  if (options.withReSyncKey) enhances.push(TableHOCS.withReSyncKey);
  if (options.withDeletableRows) enhances.push(TableHOCS.withDeletableRows);
  if (options.withLinkToDetail) enhances.push(TableHOCS.withLinkToDetail);
  if (options.withEditableCells) enhances.push(TableHOCS.withEditableCells);

  return React.memo(enhances.reduce((Wrapped, Wrapper) => Wrapper(Wrapped), Table));
}

export default Table;
