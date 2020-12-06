import {ComponentType} from 'react';
import {TableProps} from 'antd/lib/table';
// eslint-disable-next-line import/no-extraneous-dependencies
import {TableComponents} from 'rc-table/lib/interface';
import {TDictionary} from './withEditableCells/helpers';

export type MaybeTitleOrFIO = {
  title?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
};

export type MaybeIdOrIndex = {
  id?: string;
  index?: number | string;
};

export type TWithTable<TRecord> = {
  onReSyncKey?: (record: TRecord) => void;
  onSort?: (record: TRecord, insertBefore: TRecord | null, list: TRecord[]) => void;
  onSearch?: (records: TRecord[], value: string) => void;
  onLink?: (record: TRecord) => void;
  onDelete?: (record: TRecord, list: TRecord[]) => void;
  onSave?: (record: TRecord, list: TRecord[]) => void;
  onAddRow?: (list: Partial<TRecord>[]) => void;
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
