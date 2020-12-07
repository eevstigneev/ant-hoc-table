import {ComponentType} from 'react';
import {TableProps} from 'antd/lib/table';
// eslint-disable-next-line import/no-extraneous-dependencies
import {TableComponents} from 'rc-table/lib/interface';
import {TDictionary} from './withEditableCells/helpers';

export type TOnReSyncKey<TRecord> = (record: TRecord) => void;
export type TOnSort<TRecord> = (record: TRecord, insertBefore: TRecord | null, list: TRecord[]) => void;
export type TOnSearch<TRecord> = (records: TRecord[], value: string) => void;
export type TOnLink<TRecord> = (record: TRecord) => void;
export type TOnDelete<TRecord> = (record: TRecord, list: TRecord[]) => void;
export type TOnSave<TRecord> = (record: TRecord, list: TRecord[]) => void;
export type TOnAddRow<TRecord> = (list: Partial<TRecord>[]) => void;

export type TWithTable<TRecord> = {
  onReSyncKey?: TOnReSyncKey<TRecord>;
  onSort?: TOnSort<TRecord>;
  onSearch?: TOnSearch<TRecord>;
  onLink?: TOnLink<TRecord>;
  onDelete?: TOnDelete<TRecord>;
  onSave?: TOnSave<TRecord>;
  onAddRow?: TOnAddRow<TRecord>;
  initialValues?: Partial<TRecord>;
  dictionary?: TDictionary<TRecord>;
  searchPlaceholder?: string;
} & TableProps<TRecord>;

export function getDisplayName(WrappedComponent: ComponentType): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const mergeTableParts = <TRecord>(
  target?: TableComponents<TRecord>,
  source?: TableComponents<TRecord>,
): TableComponents<TRecord> | undefined => {
  if (!target) return source;
  if (!source) return target;
  const {body: targetBody = {}, header: targetHeader = {}} = target;
  const {body: sourceBody = {}, header: sourceHeader = {}} = source;
  return {
    body: {...targetBody, ...sourceBody},
    header: {...targetHeader, ...sourceHeader},
  };
};

// eslint-disable-next-line no-bitwise
export const uniq = (): string => `f${(+new Date()).toString(16)}d${(~~(Math.random() * 1e8)).toString(16)}`;
