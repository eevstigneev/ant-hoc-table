import React, {FC, useCallback, useMemo} from 'react';
import {arrayMove, SortEnd, SortEndHandler} from 'react-sortable-hoc';
import {mergeTableParts, DragHandle} from './helpers';
import {getDisplayName, TWithTable} from '../helpers';

const sortItems = <TRecord,>(list: TRecord[], {oldIndex, newIndex}: SortEnd): TRecord[] => {
  if (oldIndex === newIndex) return list;
  return arrayMove([...list], oldIndex, newIndex).filter(el => !!el);
};

const nextElement = <TRecord,>(list: TRecord[], idx: number): TRecord | null => {
  const nextIdx = idx + 1;
  if (list.length > nextIdx) return list[nextIdx];
  return null;
};

const currentItem = <TRecord,>(list: TRecord[], idx: number): TRecord | null => {
  return idx < list.length && idx > -1 ? list[idx] : null;
};

function withDraggableSortRows<TRecord extends Record<string, unknown>>(
  TableComponent: FC<TWithTable<TRecord>>,
): FC<TWithTable<TRecord>> {
  function TableSortable(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {onDraggableSort, columns = [], components = {}, ...restProps} = props;
    const handleSortEnd = useCallback<SortEndHandler>(
      sort => {
        const {oldIndex, newIndex} = sort;
        if (oldIndex === newIndex) return;
        const record = currentItem<TRecord>(dataSource, oldIndex);
        const newList = sortItems<TRecord>(dataSource, sort);
        const insertBefore = nextElement(newList, newIndex);
        if (onDraggableSort && record) onDraggableSort(record, insertBefore, newList);
      },
      [dataSource, onDraggableSort],
    );

    const tableParts = useMemo(
      () => mergeTableParts<TRecord>(components, {onSortEnd: handleSortEnd, dataSource}),
      [components, handleSortEnd, dataSource],
    );

    const mergedColumns = useMemo(() => {
      return [
        {
          dataIndex: 'sort',
          width: 30,
          className: 'drag-visible',
          render: () => <DragHandle />,
        },
        ...columns,
      ];
    }, [columns]);

    return (
      <TableComponent
        {...restProps}
        pagination={false}
        rowKey="index"
        components={tableParts}
        columns={mergedColumns}
      />
    );
  }

  TableSortable.displayName = `withDraggableSortRows(${getDisplayName(TableComponent)})`;

  return TableSortable;
}

export default withDraggableSortRows;
