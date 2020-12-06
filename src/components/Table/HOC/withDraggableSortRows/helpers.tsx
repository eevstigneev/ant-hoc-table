import React from 'react';
import {SortableContainer, SortableElement, SortableHandle, SortEndHandler} from 'react-sortable-hoc';
import {MenuOutlined} from '@ant-design/icons/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import {CustomizeComponent, TableComponents} from 'rc-table/lib/interface';
import {TBody, TRow, TRowProps, TBodyProps} from '../../TableParts';

export const DragHandle = SortableHandle(() => <MenuOutlined />);

type TSortableOptions<TRecord = Record<string, unknown>> = {
  dataSource?: TRecord[];
  onSortEnd?: SortEndHandler;
};

const makeSortable = <TProp, TOptions extends TSortableOptions = TSortableOptions>(
  type: 'tbody' | 'row',
  Component: CustomizeComponent,
  options?: TOptions,
) => {
  if (typeof Component === 'string') {
    throw Error("Type 'string' is not assignable to type 'WrappedComponent'");
  }

  const cases = {
    tbody() {
      const Sortable = SortableContainer(Component);
      return (props: TProp) => {
        return <Sortable useDragHandle helperClass="row-dragging" onSortEnd={options?.onSortEnd} {...props} />;
      };
    },
    row() {
      const Sortable = SortableElement(Component);
      return (props: TProp & Pick<TRowProps, 'className' | 'style'>) => {
        const {className, style, ...restProps} = props;
        const {dataSource = [], ...restOptions} = options as TSortableOptions;
        const index = dataSource.findIndex(x => x?.index === restProps['data-row-key']);
        return <Sortable index={index} {...restOptions} {...restProps} />;
      };
    },
  };

  return type in cases ? cases[type]() : undefined;
};

export const mergeTableParts = <TRecord extends Record<string, unknown>>(
  components: TableComponents<TRecord>,
  options?: {onSortEnd?: SortEndHandler; dataSource?: TRecord[]},
): TableComponents<TRecord> => {
  const {onSortEnd, dataSource} = options || {};
  const {body, ...restProps} = components;

  if (typeof body === 'function') {
    throw Error(`The CustomizeScrollBody is not supported for sortable rows`);
  }

  const {wrapper = TBody, row = TRow, ...restBody} = body || {};
  const newBody = {
    wrapper: makeSortable<TBodyProps>('tbody', wrapper, {onSortEnd}),
    row: makeSortable<TRowProps>('row', row, {dataSource}),
  };

  return {...restProps, body: {...restBody, ...newBody}};
};
