import React, {FC} from 'react';
import {TWithTable} from './HOC/helpers';
import * as TableHOCS from './HOC';
import Table from './Table';

type TOptions = {
  withDeletableRows?: boolean;
  withEditableCells?: boolean;
  withDraggableSortRows?: boolean;
  withLinkToDetail?: boolean;
  withSearchByTitle?: boolean;
  withAddableRows?: boolean;
  withReSyncKey?: boolean;
};

// eslint-disable-next-line import/prefer-default-export
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

  return React.memo(enhances.reduce((Wrapped, Wrapper) => React.memo(Wrapper(Wrapped)), Table));
}
