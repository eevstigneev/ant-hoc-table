import React, {FC, useCallback, useMemo} from 'react';
import {ButtonProps} from 'antd/lib/button';
import {getDisplayName, MaybeIdOrIndex, TWithTable, uniq} from '../helpers';
import {TAddRow, TitleWith} from '../../TableParts';

function withAddableRows<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableAddable(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {initialValues, onAddRow, title, ...restProps} = props;

    if (!initialValues) {
      throw Error(`defaultValues is undefined`);
    }

    const handleAddRow = useCallback(() => {
      const firstElement = (dataSource.length ? dataSource[0] : null) as MaybeIdOrIndex | null;
      const alreadyHasNewRow = firstElement && !firstElement?.id;
      if (alreadyHasNewRow) return;
      const newData = [{...initialValues, index: uniq()}, ...dataSource];
      if (onAddRow) onAddRow(newData);
    }, [dataSource, onAddRow, initialValues]);

    const Title = useMemo(
      () => TitleWith<TRecord, ButtonProps>(title, TAddRow, {onClick: handleAddRow}),
      [title, handleAddRow],
    );

    return <TableComponent {...restProps} title={Title} />;
  }

  TableAddable.displayName = `withAddableRows(${getDisplayName(TableComponent)})`;
  return TableAddable;
}
export default withAddableRows;
